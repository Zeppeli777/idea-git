/**
 * IDEA Git — Host half.
 *
 * Registers one authenticated JSON-RPC route on the Harness web server. The
 * route only speaks Git: no shell, no generic process execution. The browser
 * half never talks to git directly; it calls this route and renders the result.
 */
import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import {
  GitError,
  createRunner,
  getBlame,
  getCommitDetail,
  getCompare,
  getDiff,
  getFileHistory,
  getFiles,
  getLog,
  getRefs,
  getStashes,
  getStatus,
  repoInfo,
  resolveRepo,
  runAction,
  stageHunks,
  tryResolveRepo,
  withAttributionTrailer,
} from './git-core.js'

export const name = 'idea-git'
export const inject = ['webServer', 'connection', 'workspaceRegistry', 'agentDefaultModel', 'systemPrompt']

const API_PATH = '/idea-git/rpc'
const PING_PATH = '/idea-git/ping'
const MAX_BODY = 4 * 1024 * 1024
const SCAN_TTL = 15_000
const ATTRIBUTION_SECTION = 'idea-git:commit-attribution'
/** Placement among the prompt policies (after TEAM_POLICY 600, before PTC_ONLY 800). */
const ATTRIBUTION_SECTION_ORDER = 700
const IGNORED_DIRS = new Set([
  '.git', 'node_modules', 'dist', 'build', 'out', 'target', 'bin', 'obj', '.next', '.nuxt',
  '.venv', 'venv', '__pycache__', '.cache', '.gradle', '.idea', 'vendor', 'coverage',
])

/**
 * Identity of one live agent, read defensively.
 *
 * Field names were confirmed against a live Agent object in this Harness
 * (0.2.1-rc.2): `id` is the SessionId, `options.model`/`options.provider` are
 * the model the session actually runs, and `session.header.cwd` is its working
 * directory. Every read is guarded so an older or newer shape degrades to the
 * default-selection fallback instead of throwing.
 */
function agentIdentity(agent) {
  const options = agent?.options ?? {}
  const header = agent?.session?.header ?? {}
  return {
    id: typeof agent?.id === 'string' ? agent.id.trim() : '',
    model: typeof options.model === 'string' ? options.model.trim() : '',
    provider: typeof options.provider === 'string' ? options.provider.trim() : '',
    cwd: typeof header.cwd === 'string' ? header.cwd : '',
  }
}

/** True when `child` is `parent` or lives inside it. */
function isWithin(child, parent) {
  if (!child || !parent) return false
  const relative = path.relative(parent, child)
  if (!relative) return true
  return !relative.startsWith('..') && !path.isAbsolute(relative)
}

/** One trailer value per distinct agent working in this repository. */
function attributionFromAgents(ctx, repoRoot) {
  let agents = []
  try {
    agents = ctx.agents?.list?.() ?? []
  } catch {
    return []
  }
  if (!Array.isArray(agents) || !agents.length) return []
  const identities = agents.map(agentIdentity).filter((entry) => entry.model)
  if (!identities.length) return []
  const inRepo = repoRoot ? identities.filter((entry) => isWithin(entry.cwd, repoRoot)) : []
  const chosen = inRepo.length ? inRepo : identities
  const values = []
  for (const entry of chosen) {
    const label = entry.provider ? `dsh/${entry.provider}/${entry.model}` : `dsh/${entry.model}`
    const value = entry.id ? `${label} (session ${entry.id})` : label
    if (!values.includes(value)) values.push(value)
    if (values.length >= 3) break
  }
  return values
}

/**
 * Attribution trailers for commits this panel creates.
 *
 * Preferred source: the live agents that actually work in this repository,
 * which carries the real model and session id. Falls back to the documented
 * `agentDefaultModel` service — the *default* selection, not a per-agent fact —
 * and says so in the trailer value rather than pretending otherwise. Returns
 * null when stamping is disabled or nothing is known.
 */
function resolveAttribution(ctx, config, repoRoot) {
  if (config.stampAttribution === false) return null
  const key = typeof config.attributionKey === 'string' && config.attributionKey.trim()
    ? config.attributionKey.trim()
    : 'Assisted-by'
  const fromAgents = attributionFromAgents(ctx, repoRoot)
  if (fromAgents.length) return { key, values: fromAgents }
  let selection
  try {
    selection = ctx.agentDefaultModel?.currentSelection?.()
  } catch {
    selection = undefined
  }
  const model = typeof selection?.model === 'string' ? selection.model.trim() : ''
  if (!model) return null
  const provider = typeof selection?.provider === 'string' ? selection.provider.trim() : ''
  const label = provider ? `dsh/${provider}/${model}` : `dsh/${model}`
  return { key, values: [`${label} (default-selection)`] }
}

/** Prompt section asking agents to record their own model on the commits they make. */
function attributionSectionText() {
  return [
    'When you create a git commit in a repository, record which model produced it by',
    'appending this trailer to the commit message after a blank line:',
    '',
    'Assisted-by: dsh/<your model id>',
    '',
    'Use your own model id when your context states it; if it does not, omit the',
    'trailer rather than guessing. Never add the trailer twice to one commit, and never',
    'rewrite an existing commit message to insert it. Commits created from the IDEA Git',
    'panel are already stamped, so do not add another one there.',
  ].join('\n')
}

function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(JSON.stringify(payload))
}

async function readBody(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY) {
      req.resume()
      return null
    }
    chunks.push(chunk)
  }
  return Buffer.concat(chunks, size).toString('utf8')
}

function isDirectoryEntry(entry) {
  return entry.isDirectory() || entry.isSymbolicLink()
}

/** Detect the repositories a workspace owns, one level deep. Cached briefly. */
async function scanWorkspace(git, workspacePath, cache) {
  const cached = cache.get(workspacePath)
  if (cached && Date.now() - cached.at < SCAN_TTL) return cached.roots
  const roots = []
  const direct = await tryResolveRepo(git, workspacePath)
  if (direct) {
    roots.push(direct)
  } else {
    let entries = []
    try {
      entries = await readdir(workspacePath, { withFileTypes: true })
    } catch {
      entries = []
    }
    entries.sort((a, b) => a.name.localeCompare(b.name))
    let checked = 0
    for (const entry of entries) {
      if (roots.length >= 12 || checked >= 60) break
      if (!isDirectoryEntry(entry) || IGNORED_DIRS.has(entry.name)) continue
      const child = path.join(workspacePath, entry.name)
      if (!existsSync(path.join(child, '.git'))) continue
      checked += 1
      const root = await tryResolveRepo(git, child)
      if (root && !roots.includes(root)) roots.push(root)
    }
  }
  cache.set(workspacePath, { at: Date.now(), roots })
  return roots
}

function workspaceDtos(ctx) {
  let workspaces = []
  try {
    workspaces = ctx.workspaceRegistry.list()
  } catch {
    workspaces = []
  }
  return workspaces.slice(0, 30).map((workspace) => ({
    id: workspace.id,
    title: workspace.title,
    path: workspace.path,
  }))
}

async function bootstrap(ctx, git, params, cache, versionCache, config) {
  const refresh = Boolean(params?.refresh)
  if (refresh) cache.clear()
  const workspaces = workspaceDtos(ctx)
  const dtos = []
  for (const workspace of workspaces) {
    let roots = []
    try {
      roots = await scanWorkspace(git, workspace.path, cache)
    } catch {
      roots = []
    }
    dtos.push({ ...workspace, repos: roots })
  }
  let repo = null
  let requested = null
  let warning = ''
  if (params?.repoPath) {
    requested = String(params.repoPath)
    try {
      const root = await resolveRepo(git, requested)
      repo = await repoInfo(git, root)
    } catch (error) {
      warning = error instanceof GitError ? error.message : 'Could not open the repository.'
    }
  }
  if (!repo) {
    const first = dtos.flatMap((workspace) => workspace.repos)[0]
    if (first) {
      try {
        repo = await repoInfo(git, await resolveRepo(git, first))
      } catch {
        repo = null
      }
    }
  }
  let gitVersion = ''
  const cachedVersion = versionCache.get('git')
  if (cachedVersion && Date.now() - cachedVersion.at < 60_000) {
    gitVersion = cachedVersion.value
  } else {
    try {
      gitVersion = (await git.run(['--version'], { cwd: process.cwd() })).stdout.trim()
      versionCache.set('git', { at: Date.now(), value: gitVersion })
    } catch {
      gitVersion = ''
    }
  }
  return { workspaces: dtos, repo, requested, warning, gitVersion, scannedAt: Date.now(), attribution: resolveAttribution(ctx, config, repo?.root) }
}

const READ_METHODS = new Set([
  'repoInfo', 'refs', 'log', 'status', 'files', 'stashes', 'commit', 'diff', 'blame', 'fileHistory', 'showFile', 'compare', 'stageHunks',
])

async function dispatch(ctx, git, method, params, cache, versionCache, config) {
  if (method === 'bootstrap') return bootstrap(ctx, git, params, cache, versionCache, config)
  if (!READ_METHODS.has(method) && method !== 'action') {
    throw new GitError('unknown-method', `Unknown method: ${method}`)
  }
  if (!params || typeof params !== 'object') throw new GitError('invalid-argument', 'Parameters are required.')
  const root = await resolveRepo(git, params.repo)
  switch (method) {
    case 'repoInfo':
      return { repo: await repoInfo(git, root) }
    case 'refs':
      return { root, ...(await getRefs(git, root)) }
    case 'log':
      return { root, ...(await getLog(git, root, params)) }
    case 'status':
      return { root, ...(await getStatus(git, root)) }
    case 'files':
      return { root, ...(await getFiles(git, root)) }
    case 'stashes':
      return { root, ...(await getStashes(git, root)) }
    case 'commit':
      return { root, ...(await getCommitDetail(git, root, params.hash)) }
    case 'diff':
      return { root, ...(await getDiff(git, root, params)) }
    case 'stageHunks':
      return { root, ...(await stageHunks(git, root, params)) }
    case 'blame':
      return { root, ...(await getBlame(git, root, params)) }
    case 'compare':
      return { root, ...(await getCompare(git, root, params)) }
    case 'fileHistory':
      return { root, ...(await getFileHistory(git, root, params)) }
    case 'showFile':
      return { root, ...(await runAction(git, root, 'showFile', params)) }
    case 'action': {
      const action = String(params.action ?? '')
      // Commits this panel creates carry the attribution trailer; every other
      // action is passed through untouched.
      const actionParams = action === 'commit' && config.stampAttribution !== false
        ? { ...params, attribution: params.attribution ?? resolveAttribution(ctx, config, root) }
        : params
      const result = await runAction(git, root, action, actionParams)
      let repo = null
      try {
        repo = await repoInfo(git, root)
      } catch {
        repo = null
      }
      return { root, ...result, repo }
    }
    default:
      throw new GitError('unknown-method', `Unknown method: ${method}`)
  }
}

export function apply(ctx, config = {}) {
  const scanCache = new Map()
  const versionCache = new Map()
  const settings = {
    stampAttribution: config.stampAttribution !== false,
    agentCommitHint: config.agentCommitHint !== false,
    attributionKey: typeof config.attributionKey === 'string' && config.attributionKey.trim()
      ? config.attributionKey.trim()
      : 'Assisted-by',
  }
  const connection = () => Reflect.get(ctx, 'connection')

  // Ask agents to record their own model on the commits they create, which is
  // the common case: agent commits are made through the bash tool, not here.
  if (settings.agentCommitHint) {
    ctx.effect(() => ctx.systemPrompt.section({
      name: ATTRIBUTION_SECTION,
      order: ATTRIBUTION_SECTION_ORDER,
      text: attributionSectionText(),
    }), `idea-git: prompt section ${ATTRIBUTION_SECTION}`)
  }

  const rejected = (req, res) => {
    let rejection
    try {
      rejection = connection().requestRejection(req)
    } catch {
      rejection = 403
    }
    if (rejection === undefined) return false
    res.statusCode = rejection
    res.end()
    return true
  }

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: PING_PATH,
    handler: (req, res) => {
      if (rejected(req, res)) return
      if (req.method !== 'GET') {
        res.statusCode = 405
        res.setHeader('allow', 'GET')
        res.end()
        return
      }
      sendJson(res, 200, { ok: true, plugin: name, version: 1 })
    },
  }), `idea-git: GET ${PING_PATH}`)

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: API_PATH,
    handler: async (req, res) => {
      if (rejected(req, res)) return
      if (req.method !== 'POST') {
        res.statusCode = 405
        res.setHeader('allow', 'POST')
        res.end()
        return
      }
      const mediaType = String(req.headers['content-type'] ?? '').split(';', 1)[0]?.trim().toLowerCase()
      if (mediaType !== 'application/json') {
        sendJson(res, 415, { ok: false, error: { code: 'unsupported-media-type', message: 'content-type must be application/json' } })
        return
      }
      let text
      try {
        text = await readBody(req)
      } catch {
        sendJson(res, 400, { ok: false, error: { code: 'bad-request', message: 'request body unreadable' } })
        return
      }
      if (text === null) {
        sendJson(res, 413, { ok: false, error: { code: 'payload-too-large', message: 'request body is too large' } })
        return
      }
      let envelope
      try {
        envelope = JSON.parse(text)
      } catch {
        sendJson(res, 400, { ok: false, error: { code: 'bad-request', message: 'request body must be valid JSON' } })
        return
      }
      const method = typeof envelope?.method === 'string' ? envelope.method : ''
      if (!/^[A-Za-z][A-Za-z0-9]{0,40}$/.test(method)) {
        sendJson(res, 400, { ok: false, error: { code: 'bad-request', message: 'method must be a simple identifier' } })
        return
      }
      const started = Date.now()
      const git = createRunner()
      try {
        const value = await dispatch(ctx, git, method, envelope.params ?? {}, scanCache, versionCache, settings)
        sendJson(res, 200, {
          ok: true,
          value,
          meta: { durationMs: Date.now() - started, commands: git.commands.slice(-80) },
        })
      } catch (error) {
        const normalized = error instanceof GitError
          ? error
          : new GitError('internal-error', error instanceof Error ? error.message : String(error))
        sendJson(res, 200, {
          ok: false,
          error: { code: normalized.code, message: normalized.message, detail: normalized.detail ?? {} },
          meta: { durationMs: Date.now() - started, commands: git.commands.slice(-80) },
        })
      }
    },
  }), `idea-git: POST ${API_PATH}`)
}
