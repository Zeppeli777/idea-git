/**
 * Git engine for the IDEA Git plugin.
 *
 * This module deliberately has no Cordis / DSH imports: it is a plain Node ESM
 * library so it can be unit-tested without a Harness process. `index.js` wires
 * it to an authenticated web route.
 *
 * Safety rules:
 *  - git is always invoked through execFile with an argv array (never a shell);
 *  - user supplied refs, paths and branch names are validated before use;
 *  - every path argument follows `--`;
 *  - interactive prompts and editors are disabled by the environment.
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { existsSync } from 'node:fs'
import { mkdtemp, readFile, readdir, realpath, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

const execFileAsync = promisify(execFile)

export const EMPTY_TREE = '4b825dc642cb6eb9a060e54bf8d69288fbee4904'
const READ_TIMEOUT = 25_000
const NETWORK_TIMEOUT = 120_000
const MAX_BUFFER = 64 * 1024 * 1024

export class GitError extends Error {
  constructor(code, message, detail = {}) {
    super(message)
    this.name = 'GitError'
    this.code = code
    this.detail = detail
  }
}

function isMissing(error) {
  return Boolean(error) && (error.code === 'ENOENT' || /spawn git ENOENT|git: command not found/i.test(String(error.message)))
}

function isTimeout(error) {
  return Boolean(error) && (error.killed === true || error.signal === 'SIGTERM' || /timed out|timeout/i.test(String(error.message)))
}

function quoteForDisplay(arg) {
  if (/^[A-Za-z0-9_./:=@+%,{}~^-]+$/.test(arg)) return arg
  return '"' + String(arg).replace(/"/g, '\\"') + '"'
}

function clip(text, max) {
  const value = String(text ?? '')
  return value.length > max ? value.slice(0, max) : value
}

/** One git runner bound to a default cwd, recording a compact command trail. */
export function createRunner(options = {}) {
  const commands = []
  const baseEnv = {
    GIT_PAGER: 'cat',
    GIT_TERMINAL_PROMPT: '0',
    GIT_OPTIONAL_LOCKS: '0',
    GIT_MERGE_AUTOEDIT: 'no',
    GIT_EDITOR: ':',
    GIT_SEQUENCE_EDITOR: ':',
    LANG: 'C',
    LC_ALL: 'C',
    ...options.env,
  }

  async function run(args, runOptions = {}) {
    const started = Date.now()
    const cwd = runOptions.cwd ?? options.cwd
    const timeout = runOptions.timeout ?? READ_TIMEOUT
    const execOptions = {
      cwd,
      timeout,
      maxBuffer: runOptions.maxBuffer ?? MAX_BUFFER,
      windowsHide: true,
      encoding: 'utf8',
      env: { ...process.env, ...baseEnv, ...runOptions.env },
    }
    let stdout = ''
    let stderr = ''
    let code = 0
    try {
      const result = await execFileAsync('git', args, execOptions)
      stdout = result.stdout ?? ''
      stderr = result.stderr ?? ''
    } catch (error) {
      stdout = error.stdout ?? ''
      stderr = error.stderr ?? ''
      code = typeof error.code === 'number' ? error.code : -1
      const trail = {
        cmd: clip(`git ${args.map(quoteForDisplay).join(' ')}`, 400),
        ms: Date.now() - started,
        code: isMissing(error) ? 'ENOENT' : code,
      }
      commands.push(trail)
      if (isMissing(error)) {
        throw new GitError('git-not-found', 'Git executable was not found on PATH. Install Git and restart the Harness.', { command: args.join(' ') })
      }
      if (isTimeout(error)) {
        throw new GitError('git-timeout', `Git command timed out after ${timeout} ms.`, { command: args.join(' ') })
      }
      if (!(runOptions.allowCodes ?? []).includes(code)) {
        const message = String(stderr || stdout || error.message || 'git failed').trim()
        throw new GitError('git-failed', clip(message, 6000), {
          command: args.join(' '),
          exitCode: code,
          stderr: clip(message, 6000),
        })
      }
    }
    if (code === 0 || (runOptions.allowCodes ?? []).includes(code)) {
      commands.push({ cmd: clip(`git ${args.map(quoteForDisplay).join(' ')}`, 400), ms: Date.now() - started, code })
    }
    return { stdout: String(stdout), stderr: String(stderr), code }
  }

  return {
    run,
    commands,
    shell(args, runOptions) {
      return run(args, runOptions)
    },
  }
}

/** Resolve a user supplied directory to the canonical top level of its repo. */
export async function resolveRepo(git, input) {
  if (typeof input !== 'string' || input.trim() === '') {
    throw new GitError('invalid-repository', 'A repository path is required.')
  }
  const absolute = path.resolve(input.trim())
  let real
  try {
    real = await realpath(absolute)
  } catch {
    throw new GitError('repository-not-found', `Directory does not exist: ${absolute}`)
  }
  const info = await stat(real).catch(() => null)
  if (!info?.isDirectory()) throw new GitError('repository-not-found', `Not a directory: ${absolute}`)
  let top
  try {
    const result = await git.run(['rev-parse', '--show-toplevel'], { cwd: real })
    top = result.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)[0]
  } catch (error) {
    if (error instanceof GitError && error.code === 'git-failed') {
      throw new GitError('not-a-repository', `Not inside a Git repository: ${absolute}`)
    }
    throw error
  }
  if (!top) throw new GitError('not-a-repository', `Not inside a Git repository: ${absolute}`)
  return realpath(top).catch(() => path.resolve(top))
}

/** resolveRepo that reports absence instead of throwing. */
export async function tryResolveRepo(git, input) {
  try {
    return await resolveRepo(git, input)
  } catch {
    return null
  }
}

function gitName(root) {
  return path.basename(root) || root
}

async function readOperation(gitDir) {
  if (!gitDir) return null
  const has = (name) => existsSync(path.join(gitDir, name))
  if (has('rebase-merge') || has('rebase-apply')) return 'rebasing'
  if (has('MERGE_HEAD')) return 'merging'
  if (has('CHERRY_PICK_HEAD')) return 'cherry-picking'
  if (has('REVERT_HEAD')) return 'reverting'
  if (has('BISECT_LOG')) return 'bisecting'
  return null
}

/** Repository state + identity + branch tracking. */
export async function repoInfo(git, root) {
  const [gitDirResult, symrefResult, headResult, countResult, userNameResult, userEmailResult, remotesResult, shallowResult, upstreamResult] = await Promise.all([
    git.run(['rev-parse', '--absolute-git-dir'], { cwd: root }),
    git.run(['symbolic-ref', '--quiet', '--short', 'HEAD'], { cwd: root, allowCodes: [1, 128] }),
    git.run(['rev-parse', '--verify', 'HEAD'], { cwd: root, allowCodes: [1, 128] }),
    git.run(['rev-list', '--count', 'HEAD'], { cwd: root, allowCodes: [1, 128] }),
    git.run(['config', 'user.name'], { cwd: root, allowCodes: [1] }),
    git.run(['config', 'user.email'], { cwd: root, allowCodes: [1] }),
    git.run(['remote'], { cwd: root, allowCodes: [1] }),
    git.run(['rev-parse', '--is-shallow-repository'], { cwd: root, allowCodes: [1, 128] }),
    git.run(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}'], { cwd: root, allowCodes: [1, 128] }),
  ])
  const gitDir = gitDirResult.stdout.trim()
  const branch = symrefResult.stdout.trim()
  const head = headResult.stdout.trim() || null
  const remotes = remotesResult.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const remote = remotes.includes('origin') ? 'origin' : remotes[0] || ''
  let remoteUrl = ''
  if (remote) {
    const result = await git.run(['remote', 'get-url', remote], { cwd: root, allowCodes: [1] })
    remoteUrl = result.stdout.trim()
  }
  const upstream = upstreamResult.stdout.trim() || ''
  let ahead = 0
  let behind = 0
  if (upstream && head) {
    const result = await git.run(['rev-list', '--left-right', '--count', `HEAD...@{upstream}`], { cwd: root, allowCodes: [1, 128] })
    const [left, right] = result.stdout.trim().split(/\s+/).map((value) => Number.parseInt(value, 10) || 0)
    ahead = left
    behind = right
  }
  const commitCount = Number.parseInt(countResult.stdout.trim(), 10) || 0
  return {
    root,
    name: gitName(root),
    gitDir,
    branch: branch || (head ? head.slice(0, 8) : ''),
    head,
    shortHead: head ? head.slice(0, 8) : '',
    upstream,
    ahead,
    behind,
    detached: !branch && Boolean(head),
    empty: !head,
    commitCount,
    userName: userNameResult.stdout.trim(),
    userEmail: userEmailResult.stdout.trim(),
    remotes,
    remote,
    remoteUrl,
    shallow: shallowResult.stdout.trim() === 'true',
    operation: await readOperation(gitDir),
  }
}

function parseTrack(track) {
  const value = String(track ?? '')
  const ahead = Number.parseInt((value.match(/ahead (\d+)/) ?? [])[1] ?? '0', 10) || 0
  const behind = Number.parseInt((value.match(/behind (\d+)/) ?? [])[1] ?? '0', 10) || 0
  return { ahead, behind, gone: /gone/.test(value) }
}

/** Branches, remotes and tags with tracking information. */
export async function getRefs(git, root) {
  const format = ['%(refname)', '%(refname:short)', '%(objectname)', '%(*objectname)', '%(committerdate:unix)', '%(upstream:short)', '%(upstream:track)', '%(HEAD)', '%(subject)', '%(objecttype)', '%(symref)'].join('%00') + '%1e'
  const result = await git.run(['for-each-ref', `--format=${format}`, 'refs/heads', 'refs/remotes', 'refs/tags'], { cwd: root })
  const local = []
  const remote = []
  const tags = []
  for (const record of result.stdout.split('\x1e')) {
    const text = record.replace(/^\r?\n/, '')
    if (!text) continue
    const fields = text.split('\x00')
    if (fields.length < 11) continue
    const [fullName, short, objectName, deref, dateText, upstream, track, headMark, subject, objectType, symref] = fields
    const kind = fullName.startsWith('refs/heads/') ? 'local' : fullName.startsWith('refs/remotes/') ? 'remote' : 'tag'
    if (kind === 'remote' && (symref || short.endsWith('/HEAD'))) continue
    const sha = (deref || objectName || '').trim()
    const parsedTrack = parseTrack(track)
    const entry = {
      kind,
      fullName,
      name: short,
      hash: sha,
      date: Number.parseInt(dateText, 10) || 0,
      upstream: upstream || '',
      ahead: parsedTrack.ahead,
      behind: parsedTrack.behind,
      gone: parsedTrack.gone,
      head: headMark.trim() === '*',
      subject: subject || '',
      annotated: objectType === 'tag',
      remote: kind === 'remote' ? short.split('/')[0] : '',
    }
    if (kind === 'local') {
      entry.remote = entry.upstream ? entry.upstream.split('/')[0] : ''
      local.push(entry)
    } else if (kind === 'remote') {
      remote.push(entry)
    } else {
      tags.push(entry)
    }
  }
  local.sort((a, b) => Number(b.head) - Number(a.head) || b.date - a.date || a.name.localeCompare(b.name))
  remote.sort((a, b) => a.remote.localeCompare(b.remote) || a.name.localeCompare(b.name))
  tags.sort((a, b) => b.date - a.date || a.name.localeCompare(b.name))
  const current = local.find((entry) => entry.head)?.name ?? ''
  return { local, remote, tags, current, all: [...local, ...remote, ...tags] }
}

/** Working tree state from porcelain v2. */
export async function getStatus(git, root) {
  const result = await git.run(['status', '--porcelain=v2', '--branch', '-z'], { cwd: root })
  const tokens = result.stdout.split('\x00')
  const status = {
    branch: '',
    head: null,
    upstream: '',
    ahead: 0,
    behind: 0,
    detached: false,
    staged: [],
    unstaged: [],
    untracked: [],
    conflicted: [],
    ignored: 0,
  }
  const addXY = (xy, filePath, oldPath = null) => {
    const x = xy[0]
    const y = xy[1]
    const base = { path: filePath, oldPath, xy }
    if (x !== '.') status.staged.push({ ...base, status: x, side: 'staged' })
    if (y !== '.') status.unstaged.push({ ...base, status: y, side: 'unstaged' })
  }
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]
    if (!token) continue
    if (token.startsWith('# ')) {
      const line = token.slice(2)
      if (line.startsWith('branch.oid ')) {
        const value = line.slice(11).trim()
        status.head = value === '(initial)' ? null : value
      } else if (line.startsWith('branch.head ')) {
        const value = line.slice(12).trim()
        if (value === '(detached)') status.detached = true
        else status.branch = value
      } else if (line.startsWith('branch.upstream ')) {
        status.upstream = line.slice(16).trim()
      } else if (line.startsWith('branch.ab ')) {
        const match = line.match(/\+(\d+)\s+-(\d+)/)
        if (match) {
          status.ahead = Number.parseInt(match[1], 10) || 0
          status.behind = Number.parseInt(match[2], 10) || 0
        }
      }
      continue
    }
    const kind = token[0]
    if (kind === '1') {
      const match = token.match(/^1 ([^ ]{2}) (\S+) (\S+) (\S+) (\S+) (\S+) (\S+) (.*)$/)
      if (!match) continue
      addXY(match[1], match[8])
    } else if (kind === '2') {
      const match = token.match(/^2 ([^ ]{2}) (\S+) (\S+) (\S+) (\S+) (\S+) (\S+) (\S+) (.*)$/)
      if (!match) continue
      const oldPath = tokens[i + 1] || null
      i += 1
      addXY(match[1], match[9], oldPath)
    } else if (kind === 'u') {
      const match = token.match(/^u ([^ ]{2}) (\S+) (\S+) (\S+) (\S+) (\S+) (\S+) (\S+) (\S+) (.*)$/)
      if (!match) continue
      status.conflicted.push({ path: match[10], oldPath: null, xy: match[1], status: 'U', side: 'conflict' })
    } else if (kind === '?') {
      status.untracked.push({ path: token.slice(2), oldPath: null, xy: '??', status: '?', side: 'untracked' })
    } else if (kind === '!') {
      status.ignored += 1
    }
  }
  const byPath = (a, b) => a.path.localeCompare(b.path)
  status.staged.sort(byPath)
  status.unstaged.sort(byPath)
  status.untracked.sort(byPath)
  status.conflicted.sort(byPath)
  return status
}

/** Tracked and untracked file lists for the file picker. */
export async function getFiles(git, root) {
  const [trackedResult, untrackedResult] = await Promise.all([
    git.run(['ls-files', '-z'], { cwd: root, allowCodes: [0] }),
    git.run(['ls-files', '--others', '--exclude-standard', '-z'], { cwd: root, allowCodes: [0] }),
  ])
  const clean = (value) => value.split('\x00').filter(Boolean)
  const trackedAll = clean(trackedResult.stdout)
  const untrackedAll = clean(untrackedResult.stdout)
  const CAP = 50_000
  const UNTRACKED_CAP = 5_000
  return {
    tracked: trackedAll.slice(0, CAP),
    untracked: untrackedAll.slice(0, UNTRACKED_CAP),
    truncated: trackedAll.length > CAP || untrackedAll.length > UNTRACKED_CAP,
    total: trackedAll.length,
  }
}

function parseLogRecords(stdout) {
  const commits = []
  for (const record of stdout.split('\x1e')) {
    const text = record.replace(/^\r?\n/, '')
    if (!text) continue
    const fields = text.split('\x1f')
    if (fields.length < 10) continue
    const body = fields.length > 10 ? fields.slice(10).join('\x1f') : ''
    commits.push({
      hash: fields[0],
      parents: fields[1].split(' ').filter(Boolean),
      authorName: fields[2],
      authorEmail: fields[3],
      authorTime: Number.parseInt(fields[4], 10) || 0,
      committerName: fields[5],
      committerEmail: fields[6],
      committerTime: Number.parseInt(fields[7], 10) || 0,
      decorations: fields[8],
      subject: fields[9],
      body,
    })
  }
  return commits
}

const LOG_FORMAT = '%H%x1f%P%x1f%an%x1f%ae%x1f%at%x1f%cn%x1f%ce%x1f%ct%x1f%D%x1f%s%x1f%b%x1e'

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Commit list with parents; the client computes lanes from this. */
export async function getLog(git, root, params = {}) {
  const limit = Math.min(3000, Math.max(1, Number.parseInt(params.limit, 10) || 400))
  const skip = Math.min(100_000, Math.max(0, Number.parseInt(params.skip, 10) || 0))
  const args = ['-c', 'core.quotepath=false', 'log', '--date-order', '--no-color', '--no-show-signature', `--pretty=format:${LOG_FORMAT}`, '-n', String(limit)]
  if (skip > 0) args.push(`--skip=${skip}`)
  if (params.firstParent) args.push('--first-parent')
  if (params.grep && String(params.grep).trim()) {
    args.push('-i', '--fixed-strings', `--grep=${String(params.grep).trim().slice(0, 300)}`)
  }
  if (params.author && String(params.author).trim()) {
    args.push(`--author=${escapeRegex(String(params.author).trim().slice(0, 200))}`)
  }
  const since = validDate(params.since)
  if (since) args.push(`--since=${since}`)
  const until = validDate(params.until)
  if (until) args.push(`--until=${until}`)
  const refs = Array.isArray(params.refs) ? params.refs.map((ref) => assertRef(ref, 'ref')).slice(0, 20) : []
  if (params.all || refs.length === 0) {
    if (params.all) args.push('--branches', '--remotes', '--tags', 'HEAD')
    else args.push('HEAD')
  } else {
    args.push(...refs)
  }
  const filePath = params.path ? assertPath(params.path) : null
  if (filePath) args.push('--', filePath)
  if (!params.all && refs.length === 0 && params.emptyRepo) {
    return { commits: [], hasMore: false, nextSkip: skip }
  }
  let result
  try {
    result = await git.run(args, { cwd: root })
  } catch (error) {
    if (error instanceof GitError && /does not have any commits|unknown revision|bad revision|ambiguous argument/i.test(error.message)) {
      return { commits: [], hasMore: false, nextSkip: skip, empty: true }
    }
    throw error
  }
  const commits = parseLogRecords(result.stdout).map((commit, index) => ({ ...commit, row: skip + index }))
  return { commits, hasMore: commits.length >= limit, nextSkip: skip + commits.length, limit, skip }
}

function validDate(value) {
  if (!value) return null
  const text = String(value).trim()
  if (!/^[0-9A-Za-z :+.,/-]{1,48}$/.test(text)) return null
  return text
}

/** Changed files between two refs, for the compare-with-current workflow. */
export async function getCompare(git, root, params = {}) {
  const baseRef = assertCommitish(params.base)
  const targetRef = params.target ? assertCommitish(params.target) : 'HEAD'
  const base = (await git.run(['rev-parse', '--verify', `${baseRef}^{commit}`], { cwd: root })).stdout.trim()
  const target = (await git.run(['rev-parse', '--verify', `${targetRef}^{commit}`], { cwd: root })).stdout.trim()
  if (base === target) {
    return { base, target, baseRef, targetRef, files: [], totalAdditions: 0, totalDeletions: 0, totalFiles: 0 }
  }
  const [nameStatusResult, numstatResult] = await Promise.all([
    git.run(['-c', 'core.quotepath=false', 'diff', '--name-status', '-M', '-z', base, target], { cwd: root }),
    git.run(['-c', 'core.quotepath=false', 'diff', '--numstat', '-M', '-z', base, target], { cwd: root }),
  ])
  const files = parseNameStatusZ(nameStatusResult.stdout)
  const stats = parseNumstatZ(numstatResult.stdout)
  const merged = files.map((file) => {
    const stat = stats.get(file.path) ?? (file.oldPath ? stats.get(file.oldPath) : undefined)
    return {
      path: file.path,
      oldPath: file.oldPath,
      status: file.status,
      score: file.score,
      additions: stat?.additions ?? 0,
      deletions: stat?.deletions ?? 0,
      binary: stat?.binary ?? false,
    }
  })
  const CAP = 2000
  return {
    base,
    target,
    baseRef,
    targetRef,
    files: merged.slice(0, CAP),
    totalFiles: merged.length,
    totalAdditions: merged.reduce((sum, file) => sum + (file.additions || 0), 0),
    totalDeletions: merged.reduce((sum, file) => sum + (file.deletions || 0), 0),
  }
}

/**
 * Parse `git interpret-trailers` style output into structured trailers.
 *
 * A line starting at column zero begins a new trailer; an indented line is a
 * folded continuation of the previous value. Returns [] for empty input.
 */
export function parseTrailers(text) {
  const source = String(text ?? '')
  if (!source.trim()) return []
  const trailers = []
  for (const rawLine of source.split(/\r?\n/)) {
    if (!rawLine) continue
    if (/^\s/.test(rawLine)) {
      const last = trailers[trailers.length - 1]
      if (last) last.value = `${last.value}\n${rawLine.trim()}`.slice(0, 400)
      continue
    }
    const separator = rawLine.indexOf(':')
    if (separator <= 0) continue
    const key = rawLine.slice(0, separator).trim()
    if (!key) continue
    trailers.push({ key, value: rawLine.slice(separator + 1).trim().slice(0, 400) })
    if (trailers.length >= 20) break
  }
  return trailers
}

/** Full commit metadata plus first-parent changed files. */
export async function getCommitDetail(git, root, hash) {
  const commitHash = (await git.run(['rev-parse', '--verify', `${assertCommitish(hash)}^{commit}`], { cwd: root })).stdout.trim()
  const format = '%H%x1f%P%x1f%an%x1f%ae%x1f%at%x1f%cn%x1f%ce%x1f%ct%x1f%D%x1f%s%x1f%(trailers)%x1f%b'
  const result = await git.run(['-c', 'core.quotepath=false', 'show', '-s', '--no-color', '--no-show-signature', `--format=${format}`, commitHash, '--'], { cwd: root })
  const fields = result.stdout.split('\x1f')
  const trailers = parseTrailers(fields[10])
  // `%b` includes the trailer block; drop it so the message body and the
  // structured trailers do not render the same text twice.
  let body = fields.slice(11).join('\x1f')
  const trailerText = (fields[10] ?? '').trim()
  if (trailerText) {
    const trimmed = body.replace(/\s+$/, '')
    if (trimmed.endsWith(trailerText)) body = trimmed.slice(0, trimmed.length - trailerText.length)
  }
  body = body.replace(/\s+$/, '')
  const commit = {
    hash: fields[0],
    parents: (fields[1] ?? '').split(' ').filter(Boolean),
    authorName: fields[2] ?? '',
    authorEmail: fields[3] ?? '',
    authorTime: Number.parseInt(fields[4], 10) || 0,
    committerName: fields[5] ?? '',
    committerEmail: fields[6] ?? '',
    committerTime: Number.parseInt(fields[7], 10) || 0,
    decorations: fields[8] ?? '',
    subject: fields[9] ?? '',
    trailers,
    body,
    isMerge: (fields[1] ?? '').split(' ').filter(Boolean).length > 1,
  }
  const base = commit.parents[0] || EMPTY_TREE
  const [nameStatusResult, numstatResult] = await Promise.all([
    git.run(['-c', 'core.quotepath=false', 'diff', '--name-status', '-M', '-z', base, commitHash], { cwd: root }),
    git.run(['-c', 'core.quotepath=false', 'diff', '--numstat', '-M', '-z', base, commitHash], { cwd: root }),
  ])
  const files = parseNameStatusZ(nameStatusResult.stdout)
  const stats = parseNumstatZ(numstatResult.stdout)
  const merged = files.map((file) => {
    const stat = stats.get(file.path) ?? (file.oldPath ? stats.get(file.oldPath) : undefined)
    return {
      path: file.path,
      oldPath: file.oldPath,
      status: file.status,
      score: file.score,
      additions: stat?.additions ?? 0,
      deletions: stat?.deletions ?? 0,
      binary: stat?.binary ?? false,
    }
  })
  const CAP = 2000
  return {
    commit,
    base,
    files: merged.slice(0, CAP),
    filesTruncated: merged.length > CAP,
    totalFiles: merged.length,
    totalAdditions: merged.reduce((sum, file) => sum + (file.additions || 0), 0),
    totalDeletions: merged.reduce((sum, file) => sum + (file.deletions || 0), 0),
  }
}

export function parseNameStatusZ(stdout) {
  const tokens = String(stdout).split('\x00')
  const files = []
  let index = 0
  while (index < tokens.length) {
    const statusText = tokens[index]
    index += 1
    if (!statusText) continue
    const status = statusText[0]
    if (status === 'R' || status === 'C') {
      const oldPath = tokens[index] ?? ''
      const newPath = tokens[index + 1] ?? ''
      index += 2
      files.push({ status, score: statusText.slice(1), oldPath, path: newPath })
    } else {
      const filePath = tokens[index] ?? ''
      index += 1
      if (filePath) files.push({ status, score: '', oldPath: null, path: filePath })
    }
  }
  return files
}

export function parseNumstatZ(stdout) {
  const tokens = String(stdout).split('\x00')
  const stats = new Map()
  let index = 0
  while (index < tokens.length) {
    const token = tokens[index]
    index += 1
    if (!token) continue
    const match = token.match(/^(\d+|-)\t(\d+|-)\t(.*)$/s)
    if (!match) continue
    const additions = match[1] === '-' ? 0 : Number.parseInt(match[1], 10) || 0
    const deletions = match[2] === '-' ? 0 : Number.parseInt(match[2], 10) || 0
    const binary = match[1] === '-' || match[2] === '-'
    if (match[3] === '') {
      const oldPath = tokens[index] ?? ''
      const newPath = tokens[index + 1] ?? ''
      index += 2
      if (newPath) stats.set(newPath, { additions, deletions, binary, oldPath })
    } else {
      stats.set(match[3], { additions, deletions, binary })
    }
  }
  return stats
}

function diffContextOf(value) {
  const parsed = Number.parseInt(value, 10)
  return Number.isInteger(parsed) ? Math.min(20, Math.max(0, parsed)) : 3
}

/** Unified diff for a commit, a range, the index, the worktree or an untracked file. */
export async function getDiff(git, root, params = {}) {
  const context = diffContextOf(params.context)
  const common = ['-c', 'core.quotepath=false', 'diff', '--no-color', '--no-ext-diff', `--unified=${context}`]
  if (params.ignoreWhitespace) common.push('--ignore-all-space')

  if (params.stash !== undefined) {
    const index = assertIndex(params.stash)
    let result
    try {
      result = await git.run(['stash', 'show', '-p', '--include-untracked', `stash@{${index}}`], { cwd: root })
    } catch (error) {
      if (!(error instanceof GitError)) throw error
      result = await git.run(['stash', 'show', '-p', `stash@{${index}}`], { cwd: root })
    }
    return { raw: clip(result.stdout, 4 * 1024 * 1024), binary: false, stale: false, file: null }
  }

  if (params.untracked) {
    const filePath = assertPath(params.file)
    const absolute = path.join(root, filePath)
    let buffer
    try {
      const info = await stat(absolute)
      if (!info.isFile()) throw new Error('not a file')
      if (info.size > 2 * 1024 * 1024) {
        return { raw: '', binary: false, stale: false, file: filePath, tooLarge: true }
      }
      buffer = await readFile(absolute)
    } catch {
      throw new GitError('file-not-found', `File not found: ${filePath}`)
    }
    if (buffer.includes(0)) return { raw: '', binary: true, stale: false, file: filePath }
    const text = buffer.toString('utf8')
    const lines = text.split(/\r?\n/)
    if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop()
    const body = lines.map((line) => `+${line}`).join('\n')
    const raw = `diff --git a/${filePath} b/${filePath}\nnew file mode 100644\n--- /dev/null\n+++ b/${filePath}\n@@ -0,0 +1,${lines.length} @@${body ? `\n${body}` : ''}\n`
    return { raw: clip(raw, 4 * 1024 * 1024), binary: false, stale: false, file: filePath, additions: lines.length, deletions: 0 }
  }

  let args
  let paths = []
  if (params.hash) {
    const target = (await git.run(['rev-parse', '--verify', `${assertCommitish(params.hash)}^{commit}`], { cwd: root })).stdout.trim()
    let base = params.base ? assertCommitish(params.base) : ''
    if (!base) {
      const parents = (await git.run(['show', '-s', '--format=%P', target, '--'], { cwd: root })).stdout.trim()
      base = parents.split(' ').filter(Boolean)[0] || EMPTY_TREE
    }
    args = [...common, base, target]
    if (params.file) {
      paths = [params.oldPath ? assertPath(params.oldPath) : null, assertPath(params.file)].filter(Boolean)
    }
  } else if (params.base && params.target) {
    args = [...common, assertCommitish(params.base), assertCommitish(params.target)]
    if (params.file) paths = [assertPath(params.file)]
  } else if (params.cached) {
    args = [...common, '--cached']
    if (params.file) paths = [assertPath(params.file)]
  } else {
    args = [...common]
    if (params.file) paths = [assertPath(params.file)]
  }
  if (paths.length) args.push('--', ...paths)
  const result = await git.run(args, { cwd: root, allowCodes: [0, 1] })
  const raw = clip(result.stdout, 4 * 1024 * 1024)
  return {
    raw,
    binary: /Binary files .* differ|GIT binary patch/.test(raw),
    truncated: result.stdout.length > raw.length,
    stale: false,
    file: params.file ?? null,
  }
}

/**
 * Split a unified diff into its file header and its hunks.
 *
 * A hunk is its `@@` line plus every following line up to the next `@@` line,
 * including a trailing `\ No newline at end of file` marker. Callers can drop
 * hunks and re-emit the remainder; `git apply` accepts the partial patch
 * because each surviving hunk keeps its original header and context.
 */
export function splitDiffHunks(patch) {
  const text = String(patch ?? '')
  if (!text) return { header: '', hunks: [], binary: false }
  const lines = text.split('\n')
  if (lines.length && lines[lines.length - 1] === '') lines.pop()
  const header = []
  const hunks = []
  let current = null
  let binary = false
  for (const line of lines) {
    if (line.startsWith('GIT binary patch') || line.startsWith('Binary files ')) binary = true
    if (current === null) {
      if (line.startsWith('@@ ')) current = [line]
      else header.push(line)
    } else if (line.startsWith('@@ ')) {
      hunks.push(`${current.join('\n')}\n`)
      current = [line]
    } else {
      current.push(line)
    }
  }
  if (current) hunks.push(`${current.join('\n')}\n`)
  return { header: header.length ? `${header.join('\n')}\n` : '', hunks, binary }
}

/**
 * Append attribution trailers to a commit message unless the message already
 * carries that key. Accepts a single `value` or a `values` array (one trailer
 * line per distinct contributor). Returns the message unchanged when nothing
 * is appended.
 */
export function withAttributionTrailer(message, attribution) {
  const text = String(message ?? '')
  const key = String(attribution?.key ?? '').trim() || 'Assisted-by'
  const raw = Array.isArray(attribution?.values) ? attribution.values : [attribution?.value]
  const values = raw.map((entry) => String(entry ?? '').trim()).filter(Boolean)
  if (!values.length) return text
  if (new RegExp(`^${escapeRegex(key)}\\s*:`, 'im').test(text)) return text
  const unique = [...new Set(values)].slice(0, 3)
  const block = unique.map((value) => `${key}: ${value}`).join('\n')
  return `${text.replace(/\s+$/, '')}\n\n\n${block}\n`
}

/** Stage or unstage individual hunks of one file (IDEA-style selective staging). */
export async function stageHunks(git, root, params = {}) {
  const file = assertPath(params.file)
  const mode = params.mode === 'unstage' ? 'unstage' : 'stage'
  const requested = Array.isArray(params.hunks) ? params.hunks : []
  const indices = requested
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isInteger(value) && value >= 0)
  if (!indices.length) return { applied: 0, mode, total: 0, file }
  const context = diffContextOf(params.context)
  const args = ['-c', 'core.quotepath=false', 'diff', '--no-color', '--no-ext-diff', `--unified=${context}`]
  if (params.ignoreWhitespace) args.push('--ignore-all-space')
  if (mode === 'unstage') args.push('--cached')
  args.push('--', file)
  const result = await git.run(args, { cwd: root, allowCodes: [0, 1] })
  const parsed = splitDiffHunks(result.stdout)
  if (parsed.binary) {
    throw new GitError('binary-diff', 'Binary files cannot be staged hunk by hunk; use full stage or unstage.')
  }
  if (!parsed.hunks.length) {
    throw new GitError('no-hunks', 'This change has no hunks; use full stage or unstage.')
  }
  const selected = [...new Set(indices)].filter((index) => index < parsed.hunks.length).sort((a, b) => a - b)
  if (!selected.length) {
    throw new GitError('invalid-hunks', `No valid hunks were selected (the file has ${parsed.hunks.length}).`)
  }
  const body = parsed.hunks.filter((_, index) => selected.includes(index)).join('')
  const patch = `${parsed.header}${body}`
  const tempDir = await mkdtemp(path.join(tmpdir(), 'idea-git-hunk-'))
  try {
    const patchPath = path.join(tempDir, 'hunk.diff')
    await writeFile(patchPath, patch.endsWith('\n') ? patch : `${patch}\n`, 'utf8')
    const applyArgs = ['apply', '--cached', '--recount', '--whitespace=nowarn']
    // Zero-context patches must be declared as such or git apply mis-reads them.
    if (context === 0) applyArgs.push('--unidiff-zero')
    if (mode === 'unstage') applyArgs.push('--reverse')
    applyArgs.push(patchPath)
    await git.run(applyArgs, { cwd: root })
    return { applied: selected.length, mode, total: parsed.hunks.length, file }
  } finally {
    await rm(tempDir, { recursive: true, force: true }).catch(() => {})
  }
}

/** line-porcelain blame parsed into one record per line. */
export async function getBlame(git, root, params = {}) {
  const filePath = assertPath(params.file)
  const args = ['blame', '--line-porcelain']
  if (params.ignoreWhitespace) args.push('-w')
  const rev = params.rev && params.rev !== 'WORKTREE' ? assertCommitish(params.rev) : null
  if (rev) args.push(rev)
  args.push('--', filePath)
  let result
  try {
    result = await git.run(args, { cwd: root })
  } catch (error) {
    if (error instanceof GitError && /no such path|does not exist|no such file/i.test(error.message)) {
      throw new GitError('file-not-found', `File is not tracked at this revision: ${filePath}`)
    }
    throw error
  }
  const lines = []
  const CAP = 4000
  let current = null
  let truncated = false
  for (const line of result.stdout.split(/\r?\n/)) {
    if (lines.length >= CAP) {
      truncated = true
      break
    }
    if (line.startsWith('\t')) {
      if (!current) continue
      lines.push({
        hash: current.hash,
        author: current.author,
        email: current.email,
        time: current.time,
        summary: current.summary,
        filename: current.filename,
        origLine: current.origLine,
        finalLine: current.finalLine,
        content: line.slice(1),
      })
      current = null
      continue
    }
    const header = line.match(/^([0-9a-f]{40,64}) (\d+) (\d+)(?: (\d+))?$/)
    if (header) {
      current = {
        hash: header[1],
        origLine: Number.parseInt(header[2], 10),
        finalLine: Number.parseInt(header[3], 10),
        groupSize: header[4] ? Number.parseInt(header[4], 10) : 1,
        author: '',
        email: '',
        time: 0,
        summary: '',
        filename: filePath,
      }
      continue
    }
    if (!current) continue
    if (line.startsWith('author ')) current.author = line.slice(7)
    else if (line.startsWith('author-mail ')) current.email = line.slice(12).replace(/^<|>$/g, '')
    else if (line.startsWith('author-time ')) current.time = Number.parseInt(line.slice(12), 10) || 0
    else if (line.startsWith('summary ')) current.summary = line.slice(8)
    else if (line.startsWith('filename ')) current.filename = line.slice(9)
  }
  return { lines, truncated, file: filePath, rev: rev || 'WORKTREE' }
}

/** History for one path, following renames. */
export async function getFileHistory(git, root, params = {}) {
  const filePath = assertPath(params.file)
  const limit = Math.min(500, Math.max(1, Number.parseInt(params.limit, 10) || 200))
  const result = await git.run(['-c', 'core.quotepath=false', 'log', '--follow', '--date-order', '--no-color', '--no-show-signature', `--pretty=format:${LOG_FORMAT}`, '-n', String(limit), '--', filePath], { cwd: root })
  const commits = parseLogRecords(result.stdout).map((commit, index) => ({ ...commit, row: index }))
  return { commits, hasMore: commits.length >= limit, file: filePath, limit }
}

/** Stash entries. */
export async function getStashes(git, root) {
  const result = await git.run(['stash', 'list', '--pretty=format:%gd%x1f%H%x1f%ct%x1f%gs%x1e'], { cwd: root })
  const stashes = []
  for (const record of result.stdout.split('\x1e')) {
    const text = record.replace(/^\r?\n/, '')
    if (!text) continue
    const [ref, hash, time, subject] = text.split('\x1f')
    const indexMatch = String(ref ?? '').match(/\{(\d+)\}/)
    stashes.push({
      index: indexMatch ? Number.parseInt(indexMatch[1], 10) : stashes.length,
      ref: ref ?? '',
      hash: hash ?? '',
      time: Number.parseInt(time, 10) || 0,
      subject: subject ?? '',
    })
  }
  return { stashes }
}

/* ------------------------------------------------------------------ *
 * Validation
 * ------------------------------------------------------------------ */

export function assertRef(value, label = 'ref') {
  if (typeof value !== 'string') throw new GitError('invalid-argument', `${label} must be a string.`)
  const text = value.trim()
  if (!text || text.length > 300) throw new GitError('invalid-argument', `${label} is empty or too long.`)
  if (!/^[A-Za-z0-9_][A-Za-z0-9_./@{}~^:+-]*$/.test(text)) {
    throw new GitError('invalid-argument', `Invalid ${label}: ${text}`)
  }
  return text
}

export function assertCommitish(value) {
  if (typeof value !== 'string' || !value.trim()) throw new GitError('invalid-argument', 'A commit or ref is required.')
  const text = value.trim()
  if (/^[0-9a-f]{4,64}$/i.test(text)) return text
  return assertRef(text, 'commit')
}

export function assertPath(value) {
  if (typeof value !== 'string' || !value.trim()) throw new GitError('invalid-argument', 'A file path is required.')
  const text = value.replace(/\\/g, '/').trim()
  if (text.length > 2000 || text.includes('\x00')) throw new GitError('invalid-argument', 'Invalid file path.')
  if (text.startsWith('/') || /^[A-Za-z]:\//.test(text)) throw new GitError('invalid-argument', `File path must be relative: ${text}`)
  if (text.startsWith(':') || text.startsWith('-')) throw new GitError('invalid-argument', `Invalid file path: ${text}`)
  const normalized = path.posix.normalize(text)
  if (normalized === '..' || normalized.startsWith('../')) throw new GitError('invalid-argument', `File path escapes the repository: ${text}`)
  return normalized
}

function assertIndex(value) {
  const index = Number.parseInt(value, 10)
  if (!Number.isInteger(index) || index < 0 || index > 1000) throw new GitError('invalid-argument', 'Invalid stash index.')
  return index
}

function assertMessage(value) {
  if (typeof value !== 'string' || value.length > 100_000 || value.includes('\x00')) {
    throw new GitError('invalid-argument', 'Invalid commit message.')
  }
  return value
}

function assertRemote(value) {
  if (value === undefined || value === null || value === '') return ''
  if (typeof value !== 'string' || !/^[A-Za-z0-9._-]{1,120}$/.test(value)) throw new GitError('invalid-argument', 'Invalid remote name.')
  return value
}

function assertPaths(value, { allowEmpty = false } = {}) {
  if (!Array.isArray(value)) {
    if (allowEmpty) return []
    throw new GitError('invalid-argument', 'A list of file paths is required.')
  }
  const paths = value.slice(0, 2000).map((entry) => assertPath(entry))
  if (!paths.length && !allowEmpty) throw new GitError('invalid-argument', 'No files were selected.')
  return [...new Set(paths)]
}

async function currentBranch(git, root) {
  const result = await git.run(['symbolic-ref', '--quiet', '--short', 'HEAD'], { cwd: root, allowCodes: [1, 128] })
  return result.stdout.trim()
}

async function operation(git, root) {
  const gitDir = (await git.run(['rev-parse', '--absolute-git-dir'], { cwd: root })).stdout.trim()
  return readOperation(gitDir)
}

/* ------------------------------------------------------------------ *
 * Mutating operations
 * ------------------------------------------------------------------ */

export async function runAction(git, root, action, params = {}) {
  switch (action) {
    case 'stage': {
      const all = Boolean(params.all)
      const paths = all ? [] : assertPaths(params.paths)
      const result = await git.run(all ? ['add', '-A'] : ['add', '-A', '--', ...paths], { cwd: root })
      return { output: result.stdout, count: all ? -1 : paths.length }
    }
    case 'unstage': {
      const all = Boolean(params.all)
      const paths = all ? [] : assertPaths(params.paths)
      const args = all ? ['restore', '--staged', '--', '.'] : ['restore', '--staged', '--', ...paths]
      try {
        const result = await git.run(args, { cwd: root })
        return { output: result.stdout, count: all ? -1 : paths.length }
      } catch (error) {
        if (!(error instanceof GitError) || !/could not resolve HEAD|ambiguous argument|unknown revision/i.test(error.message)) throw error
        const fallback = await git.run(all ? ['rm', '--cached', '-r', '--', '.'] : ['rm', '--cached', '-r', '--', ...paths], { cwd: root })
        return { output: fallback.stdout, count: all ? -1 : paths.length }
      }
    }
    case 'discard': {
      const entries = Array.isArray(params.entries) ? params.entries : []
      if (!entries.length) throw new GitError('invalid-argument', 'No files were selected.')
      const untracked = []
      let output = ''
      for (const entry of entries.slice(0, 2000)) {
        const filePath = assertPath(entry?.path)
        if (entry?.untracked) {
          untracked.push(filePath)
          continue
        }
        const inHead = await git.run(['cat-file', '-e', `HEAD:${filePath}`], { cwd: root, allowCodes: [1, 128] })
        if (inHead.code === 0) {
          const result = await git.run(['restore', '--source=HEAD', '--staged', '--worktree', '--', filePath], { cwd: root })
          output += result.stdout
        } else {
          const removed = await git.run(['rm', '-f', '--', filePath], { cwd: root, allowCodes: [0, 1, 128] })
          output += removed.stdout
          if (entry?.oldPath) {
            const oldPath = assertPath(entry.oldPath)
            if (oldPath !== filePath) {
              const restored = await git.run(['restore', '--source=HEAD', '--staged', '--worktree', '--', oldPath], { cwd: root, allowCodes: [0, 1, 128] })
              output += restored.stdout
            }
          }
        }
      }
      if (untracked.length) {
        const result = await git.run(['clean', '-f', '-d', '--', ...untracked], { cwd: root })
        output += result.stdout
      }
      return { output }
    }
    case 'commit': {
      let message = assertMessage(params.message ?? '')
      const amend = Boolean(params.amend)
      const signoff = Boolean(params.signoff)
      if (!message.trim() && !amend) throw new GitError('invalid-argument', 'A commit message is required.')
      if (params.stageAll) await git.run(['add', '-A'], { cwd: root })
      const args = ['commit']
      if (message.trim()) {
        // Stamp only when this call supplies the message; `--amend --no-edit`
        // reuses the old message and cannot be extended safely.
        message = withAttributionTrailer(message, params.attribution)
        args.push('-m', message)
      } else if (amend) {
        args.push('--no-edit')
      }
      if (amend) args.push('--amend')
      if (signoff) args.push('--signoff')
      const result = await git.run(args, { cwd: root, timeout: NETWORK_TIMEOUT })
      const hash = (await git.run(['rev-parse', '--short', 'HEAD'], { cwd: root })).stdout.trim()
      return { output: result.stdout, hash }
    }
    case 'checkout': {
      const ref = assertRef(params.ref)
      const local = await git.run(['show-ref', '--verify', '--quiet', `refs/heads/${ref}`], { cwd: root, allowCodes: [1] })
      const remote = await git.run(['show-ref', '--verify', '--quiet', `refs/remotes/${ref}`], { cwd: root, allowCodes: [1] })
      if (remote.code === 0 && local.code !== 0) {
        const result = await git.run(['checkout', '--track', ref], { cwd: root, timeout: NETWORK_TIMEOUT })
        return { output: result.stdout, tracked: true }
      }
      try {
        const result = await git.run(['checkout', ref, '--'], { cwd: root, timeout: NETWORK_TIMEOUT })
        return { output: result.stdout }
      } catch (error) {
        if (!(error instanceof GitError) || !/did not match any|not a commit|pathspec/i.test(error.message)) throw error
        const result = await git.run(['checkout', '--track', ref], { cwd: root, timeout: NETWORK_TIMEOUT })
        return { output: result.stdout, tracked: true }
      }
    }
    case 'createBranch': {
      if (typeof params.name !== 'string' || !params.name.trim()) throw new GitError('invalid-argument', 'A branch name is required.')
      const name = params.name.trim()
      if (!/^[A-Za-z0-9_][A-Za-z0-9_./-]{0,200}$/.test(name)) throw new GitError('invalid-argument', `Invalid branch name: ${name}`)
      try {
        await git.run(['check-ref-format', '--branch', name], { cwd: root })
      } catch {
        throw new GitError('invalid-argument', `Invalid branch name: ${name}`)
      }
      const start = params.startPoint ? assertCommitish(params.startPoint) : ''
      const args = start ? ['branch', name, start] : ['branch', name]
      const result = await git.run(args, { cwd: root })
      if (params.checkout) await git.run(['checkout', name], { cwd: root, timeout: NETWORK_TIMEOUT })
      return { output: result.stdout, name }
    }
    case 'deleteBranch': {
      const name = assertRef(params.name, 'branch')
      const result = await git.run(['branch', params.force ? '-D' : '-d', name], { cwd: root })
      return { output: result.stdout }
    }
    case 'merge': {
      const ref = assertRef(params.ref)
      const args = ['merge', '--no-edit']
      if (params.noFf) args.push('--no-ff')
      args.push(ref)
      const result = await git.run(args, { cwd: root, timeout: NETWORK_TIMEOUT })
      return { output: result.stdout }
    }
    case 'rebase': {
      const ref = assertRef(params.ref)
      const result = await git.run(['rebase', ref], { cwd: root, timeout: NETWORK_TIMEOUT })
      return { output: result.stdout }
    }
    case 'cherryPick': {
      const ref = assertCommitish(params.ref)
      const parents = (await git.run(['show', '-s', '--format=%P', ref, '--'], { cwd: root })).stdout.trim().split(' ').filter(Boolean)
      if (parents.length > 1) throw new GitError('invalid-argument', 'Cherry-picking a merge commit needs a mainline parent; use the terminal for this commit.')
      const result = await git.run(['cherry-pick', ref], { cwd: root, timeout: NETWORK_TIMEOUT })
      return { output: result.stdout }
    }
    case 'revert': {
      const ref = assertCommitish(params.ref)
      const parents = (await git.run(['show', '-s', '--format=%P', ref, '--'], { cwd: root })).stdout.trim().split(' ').filter(Boolean)
      if (parents.length > 1) throw new GitError('invalid-argument', 'Reverting a merge commit needs a mainline parent; use the terminal for this commit.')
      const result = await git.run(['revert', '--no-edit', ref], { cwd: root, timeout: NETWORK_TIMEOUT })
      return { output: result.stdout }
    }
    case 'reset': {
      const ref = assertCommitish(params.ref)
      const mode = params.mode || 'mixed'
      if (!['soft', 'mixed', 'hard', 'keep'].includes(mode)) throw new GitError('invalid-argument', 'Invalid reset mode.')
      const result = await git.run(['reset', `--${mode}`, ref], { cwd: root, timeout: NETWORK_TIMEOUT })
      return { output: result.stdout }
    }
    case 'fetch': {
      const remote = assertRemote(params.remote)
      const args = remote ? ['fetch', remote, '--prune'] : ['fetch', '--all', '--prune']
      const result = await git.run(args, { cwd: root, timeout: NETWORK_TIMEOUT })
      return { output: result.stdout }
    }
    case 'pull': {
      const args = ['pull', '--no-edit']
      if (params.rebase) args.push('--rebase')
      const result = await git.run(args, { cwd: root, timeout: NETWORK_TIMEOUT })
      return { output: result.stdout }
    }
    case 'push': {
      const branch = params.branch ? assertRef(params.branch, 'branch') : await currentBranch(git, root)
      if (!branch) throw new GitError('invalid-argument', 'Cannot push a detached HEAD.')
      let remote = assertRemote(params.remote)
      if (!remote) {
        const remotes = (await git.run(['remote'], { cwd: root, allowCodes: [1] })).stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
        if (!remotes.length) throw new GitError('invalid-argument', 'No Git remote is configured.')
        remote = remotes.includes('origin') ? 'origin' : remotes[0]
      }
      const upstream = (await git.run(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}'], { cwd: root, allowCodes: [1, 128] })).stdout.trim()
      const args = params.setUpstream || !upstream ? ['push', '-u', remote, branch] : ['push', remote, branch]
      const result = await git.run(args, { cwd: root, timeout: NETWORK_TIMEOUT })
      return { output: result.stdout }
    }
    case 'stashPush': {
      const message = params.message ? assertMessage(params.message) : ''
      const args = ['stash', 'push']
      if (params.includeUntracked !== false) args.push('-u')
      if (message.trim()) args.push('-m', message)
      const result = await git.run(args, { cwd: root, timeout: NETWORK_TIMEOUT })
      return { output: result.stdout }
    }
    case 'stashApply': {
      const index = assertIndex(params.index)
      const verb = params.pop ? 'pop' : 'apply'
      const result = await git.run(['stash', verb, `stash@{${index}}`], { cwd: root, timeout: NETWORK_TIMEOUT })
      return { output: result.stdout }
    }
    case 'stashDrop': {
      const index = assertIndex(params.index)
      const result = await git.run(['stash', 'drop', `stash@{${index}}`], { cwd: root })
      return { output: result.stdout }
    }
    case 'abort': {
      const state = await operation(git, root)
      const commands = {
        merging: ['merge', '--abort'],
        rebasing: ['rebase', '--abort'],
        'cherry-picking': ['cherry-pick', '--abort'],
        reverting: ['revert', '--abort'],
        bisecting: ['bisect', 'reset'],
      }
      if (!state || !commands[state]) throw new GitError('invalid-argument', 'No operation is in progress.')
      const result = await git.run(commands[state], { cwd: root, timeout: NETWORK_TIMEOUT })
      return { output: result.stdout, operation: state }
    }
    case 'continue': {
      const state = await operation(git, root)
      const commands = {
        merging: ['merge', '--continue'],
        rebasing: ['rebase', '--continue'],
        'cherry-picking': ['cherry-pick', '--continue'],
        reverting: ['revert', '--continue'],
      }
      if (!state || !commands[state]) throw new GitError('invalid-argument', 'No operation can be continued.')
      const result = await git.run(commands[state], { cwd: root, timeout: NETWORK_TIMEOUT })
      return { output: result.stdout, operation: state }
    }
    case 'showFile': {
      const rev = assertCommitish(params.rev)
      const file = assertPath(params.file)
      const result = await git.run(['show', `${rev}:${file}`], { cwd: root, maxBuffer: 8 * 1024 * 1024 })
      return { content: clip(result.stdout, 1024 * 1024), truncated: result.stdout.length > 1024 * 1024, file, rev }
    }
    case 'tagCreate': {
      if (typeof params.name !== 'string' || !params.name.trim()) throw new GitError('invalid-argument', 'A tag name is required.')
      const tagName = params.name.trim()
      if (!/^[A-Za-z0-9_][A-Za-z0-9_./-]{0,200}$/.test(tagName)) throw new GitError('invalid-argument', `Invalid tag name: ${tagName}`)
      try {
        await git.run(['check-ref-format', `refs/tags/${tagName}`], { cwd: root })
      } catch {
        throw new GitError('invalid-argument', `Invalid tag name: ${tagName}`)
      }
      const ref = params.ref ? assertCommitish(params.ref) : 'HEAD'
      const message = params.message ? assertMessage(params.message) : ''
      const args = message.trim() ? ['tag', '-a', tagName, ref, '-m', message] : ['tag', tagName, ref]
      const result = await git.run(args, { cwd: root })
      return { output: result.stdout, name: tagName, ref }
    }
    case 'resolveConflict': {
      const file = assertPath(params.file)
      const side = params.side
      if (side !== 'ours' && side !== 'theirs') throw new GitError('invalid-argument', 'Conflict side must be ours or theirs.')
      const result = await git.run(['checkout', `--${side}`, '--', file], { cwd: root })
      await git.run(['add', '--', file], { cwd: root })
      return { output: result.stdout, file, side }
    }
    case 'rebaseApply': {
      const base = assertCommitish(params.base)
      const rawSteps = Array.isArray(params.steps) ? params.steps : []
      if (!rawSteps.length || rawSteps.length > 50) throw new GitError('invalid-argument', 'A rebase plan needs 1 to 50 commits.')
      const actions = new Set(['pick', 'squash', 'fixup', 'drop'])
      const steps = rawSteps.map((step) => {
        const hash = assertCommitish(step?.hash)
        const action = String(step?.action || 'pick')
        if (!actions.has(action)) throw new GitError('invalid-argument', `Invalid rebase action: ${action}`)
        const subject = String(step?.subject || '').replace(/[\r\n]+/g, ' ').slice(0, 120)
        return { hash, action, subject }
      })
      const unique = new Set(steps.map((step) => step.hash))
      if (unique.size !== steps.length) throw new GitError('invalid-argument', 'The rebase plan contains duplicate commits.')
      const kept = steps.filter((step) => step.action !== 'drop')
      if (!kept.length) throw new GitError('invalid-argument', 'The plan drops every commit; use reset instead.')
      if (kept[0].action !== 'pick') throw new GitError('invalid-argument', 'The first kept commit must be a pick.')
      const revList = await git.run(['rev-list', '--reverse', '--first-parent', `${base}..HEAD`], { cwd: root })
      const actual = revList.stdout.split(/\r?\n/).filter(Boolean)
      if (actual.length !== steps.length || actual.some((hash) => !unique.has(hash))) {
        throw new GitError('stale-plan', 'The branch moved while the rebase planner was open. Reopen it and try again.')
      }
      for (const step of steps) {
        const parents = (await git.run(['show', '-s', '--format=%P', step.hash, '--'], { cwd: root })).stdout.trim().split(' ').filter(Boolean)
        if (parents.length > 1) throw new GitError('unsupported-history', 'Interactive rebase over merge commits is not supported; use the terminal for this range.')
      }
      const tempDir = await mkdtemp(path.join(tmpdir(), 'idea-git-rebase-'))
      const planPath = path.join(tempDir, 'plan.txt')
      try {
        const todo = steps.map((step) => `${step.action} ${step.hash} ${step.subject}`).join('\n') + '\n'
        await writeFile(planPath, todo, 'utf8')
        const result = await git.run(['rebase', '-i', '--autostash', base], {
          cwd: root,
          timeout: NETWORK_TIMEOUT,
          env: {
            IDEA_GIT_TODO: planPath,
            GIT_SEQUENCE_EDITOR: 'cp "$IDEA_GIT_TODO"',
          },
        })
        return { output: result.stdout, steps: steps.length }
      } finally {
        await rm(tempDir, { recursive: true, force: true }).catch(() => {})
      }
    }
    default:
      throw new GitError('unknown-action', `Unknown git action: ${action}`)
  }
}

export const internals = {
  parseLogRecords,
  parseNameStatusZ,
  parseNumstatZ,
  validDate,
  quoteForDisplay,
  readOperation,
  escapeRegex,
}
