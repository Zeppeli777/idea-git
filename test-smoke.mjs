import assert from 'node:assert/strict'
import { cp, readFile, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { createFileRunner } from './test-runner.mjs'
import {
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
  splitDiffHunks,
  stageHunks,
} from './git-core.js'

const repoPath = process.argv[2]
if (!repoPath) throw new Error('usage: node test-smoke.mjs <repo>')
const makeRunner = process.env.IG_REAL_RUNNER === '1' ? createRunner : createFileRunner
const git = makeRunner({ cwd: path.dirname(repoPath) })
const log = (label, value) => console.log(`✓ ${label}${value === undefined ? '' : `: ${JSON.stringify(value).slice(0, 220)}`}`)

// Work on a copy with a known dirty state, so the checks never depend on
// whatever the demo repository happens to contain right now.
const source = path.resolve(repoPath)
const work = path.join(path.dirname(source), '.tmp-smoke')
await rm(work, { recursive: true, force: true })
await cp(source, work, { recursive: true, force: true })
const root = await resolveRepo(git, work)
await git.run(['reset', '--hard', 'HEAD'], { cwd: root })
const readmePath = path.join(root, 'README.md')
const readme = await readFile(readmePath, 'utf8')
await writeFile(readmePath, `${readme.replace(/\s+$/, '')}\n\nWorking tree edit.\n`)
await writeFile(path.join(root, 'staged.txt'), 'staged file\n')
await git.run(['add', 'staged.txt'], { cwd: root })
await writeFile(path.join(root, 'untracked.txt'), 'untracked\ncontent\n')

const info = await repoInfo(git, root)
assert.equal(info.branch, 'main')
assert.ok(info.commitCount >= 6)
assert.equal(info.operation, null)
log('repoInfo', { branch: info.branch, commits: info.commitCount, user: info.userName })

const refs = await getRefs(git, root)
assert.equal(refs.current, 'main')
assert.equal(refs.local.length, 3)
assert.equal(refs.tags.length, 1)
assert.ok(refs.local.find((entry) => entry.name === 'main')?.head)
log('refs', { local: refs.local.map((entry) => entry.name), tags: refs.tags.map((entry) => entry.name) })

const history = await getLog(git, root, { all: true, limit: 100 })
assert.ok(history.commits.length >= 6)
const merge = history.commits.find((commit) => commit.parents.length === 2)
assert.ok(merge)
assert.equal(merge.subject, 'merge: feature/graph into main')
log('log', { commits: history.commits.length, merge: merge.hash.slice(0, 8), refs: merge.decorations })

const detail = await getCommitDetail(git, root, merge.hash)
assert.ok(detail.commit.isMerge)
assert.ok(detail.files.some((file) => file.path === 'src/graph.js'))
assert.ok(detail.totalFiles >= 1)
log('merge detail', { files: detail.files.map((file) => `${file.status}:${file.path}`), additions: detail.totalAdditions })

const status = await getStatus(git, root)
assert.ok(status.staged.some((file) => file.path === 'staged.txt'))
assert.ok(status.unstaged.some((file) => file.path === 'README.md'))
assert.ok(status.untracked.some((file) => file.path === 'untracked.txt'))
log('status', { staged: status.staged.length, unstaged: status.unstaged.length, untracked: status.untracked.length })

const workDiff = await getDiff(git, root, { file: 'README.md' })
assert.match(workDiff.raw, /\+Working tree edit\./)
log('worktree diff', { bytes: workDiff.raw.length })

const stagedDiff = await getDiff(git, root, { file: 'staged.txt', cached: true })
assert.match(stagedDiff.raw, /\+.*staged file/)
log('index diff', { bytes: stagedDiff.raw.length })

const untrackedDiff = await getDiff(git, root, { file: 'untracked.txt', untracked: true })
assert.match(untrackedDiff.raw, /\+.*untracked/)
assert.equal(untrackedDiff.additions, 2)
log('untracked diff', { additions: untrackedDiff.additions })

const blame = await getBlame(git, root, { file: 'README.md', rev: 'HEAD' })
assert.ok(blame.lines.length >= 4)
assert.ok(blame.lines.every((line) => /^[0-9a-f]{40,64}$/.test(line.hash)))
log('blame', { lines: blame.lines.length, first: blame.lines[0]?.author })

const fileHistory = await getFileHistory(git, root, { file: 'src/graph.js' })
assert.equal(fileHistory.commits.length, 2)
log('file history', { commits: fileHistory.commits.length })

const files = await getFiles(git, root)
assert.ok(files.tracked.includes('README.md'))
assert.ok(files.untracked.includes('untracked.txt'))
log('files', { tracked: files.tracked.length, untracked: files.untracked.length })

const stash = await getStashes(git, root)
assert.equal(stash.stashes.length, 1)
const stashDiff = await getDiff(git, root, { stash: 0 })
assert.match(stashDiff.raw, /\+Stashed work\./)
log('stash', { entries: stash.stashes.length, bytes: stashDiff.raw.length })

// Mutation tests run on a copy so the fixture and its dirty state stay intact.
const clone = path.join(path.dirname(root), '.tmp-repo-copy')
const git2 = makeRunner({ cwd: path.dirname(root) })
await rm(clone, { recursive: true, force: true })
await cp(root, clone, { recursive: true, force: true })
const cloneRoot = await resolveRepo(git2, clone)
await git2.run(['config', 'user.name', 'Test Runner'], { cwd: cloneRoot })
await git2.run(['config', 'user.email', 'test@example.com'], { cwd: cloneRoot })

await runAction(git2, cloneRoot, 'createBranch', { name: 'test/action', checkout: true })
assert.equal((await repoInfo(git2, cloneRoot)).branch, 'test/action')
const baseCount = (await repoInfo(git2, cloneRoot)).commitCount
await writeFile(path.join(cloneRoot, 'action.txt'), 'action\n')
await runAction(git2, cloneRoot, 'stage', { all: true })
const commit = await runAction(git2, cloneRoot, 'commit', { message: 'test: action commit' })
assert.match(commit.hash, /^[0-9a-f]+$/)
log('commit action', { hash: commit.hash })
await runAction(git2, cloneRoot, 'reset', { ref: 'HEAD~1', mode: 'hard' })
assert.equal((await repoInfo(git2, cloneRoot)).commitCount, baseCount)
await runAction(git2, cloneRoot, 'checkout', { ref: 'main' })
await runAction(git2, cloneRoot, 'deleteBranch', { name: 'test/action', force: true })
assert.equal((await getRefs(git2, cloneRoot)).local.length, 3)
log('branch actions', { local: (await getRefs(git2, cloneRoot)).local.length })

// Rename and binary parsing.
await git2.run(['mv', 'app.js', 'app-renamed.js'], { cwd: cloneRoot })
await git2.run(['commit', '-m', 'refactor: rename app entry'], { cwd: cloneRoot })
const renameCommit = (await getLog(git2, cloneRoot, { limit: 1 })).commits[0]
const renameDetail = await getCommitDetail(git2, cloneRoot, renameCommit.hash)
const renamed = renameDetail.files.find((file) => file.path === 'app-renamed.js')
assert.equal(renamed?.status, 'R')
assert.equal(renamed?.oldPath, 'app.js')
log('rename detail', { status: renamed.status, oldPath: renamed.oldPath })

await writeFile(path.join(cloneRoot, 'binary.dat'), Buffer.from([0, 1, 2, 3, 0, 255]))
await git2.run(['add', 'binary.dat'], { cwd: cloneRoot })
await git2.run(['commit', '-m', 'chore: add binary fixture'], { cwd: cloneRoot })
const binaryCommit = (await getLog(git2, cloneRoot, { limit: 1 })).commits[0]
const binaryDetail = await getCommitDetail(git2, cloneRoot, binaryCommit.hash)
const binaryFile = binaryDetail.files.find((file) => file.path === 'binary.dat')
assert.equal(binaryFile?.binary, true)
const binaryDiff = await getDiff(git2, cloneRoot, { hash: binaryCommit.hash, file: 'binary.dat' })
assert.equal(binaryDiff.binary, true)
log('binary detail', { binary: binaryFile.binary, diffBinary: binaryDiff.binary })
await git2.run(['reset', '--hard', 'HEAD~2'], { cwd: cloneRoot })

const firstParent = await getLog(git2, cloneRoot, { all: true, firstParent: true, limit: 100 })
assert.ok(firstParent.commits.length >= 5)
log('first-parent log', { commits: firstParent.commits.length })

const stashBaseline = (await getStashes(git2, cloneRoot)).stashes.length
await writeFile(path.join(cloneRoot, 'README.md'), '# Demo\n\nChanged for stash.\n')
await runAction(git2, cloneRoot, 'stashPush', { message: 'test stash' })
assert.equal((await getStashes(git2, cloneRoot)).stashes.length, stashBaseline + 1)
await runAction(git2, cloneRoot, 'stashApply', { index: 0 })
assert.match((await getDiff(git2, cloneRoot, { file: 'README.md' })).raw, /Changed for stash/)
await runAction(git2, cloneRoot, 'stashDrop', { index: 0 })
assert.equal((await getStashes(git2, cloneRoot)).stashes.length, stashBaseline)
log('stash actions', { remaining: stashBaseline })

// Rename status and an in-progress merge conflict.
await git2.run(['reset', '--hard', 'HEAD'], { cwd: cloneRoot })
await writeFile(path.join(cloneRoot, 'discard-me.txt'), 'temporary\n')
await runAction(git2, cloneRoot, 'stage', { paths: ['discard-me.txt'] })
await runAction(git2, cloneRoot, 'discard', { entries: [{ path: 'discard-me.txt', untracked: false }] })
assert.equal(existsSync(path.join(cloneRoot, 'discard-me.txt')), false)
await git2.run(['mv', 'app.js', 'app-moved.js'], { cwd: cloneRoot })
await runAction(git2, cloneRoot, 'discard', { entries: [{ path: 'app-moved.js', oldPath: 'app.js', untracked: false }] })
assert.equal(existsSync(path.join(cloneRoot, 'app.js')), true)
assert.equal(existsSync(path.join(cloneRoot, 'app-moved.js')), false)
log('discard actions', { newFile: 'removed', rename: 'restored' })

await git2.run(['checkout', '-b', 'status/rename'], { cwd: cloneRoot })
await git2.run(['mv', 'README.md', 'README-renamed.md'], { cwd: cloneRoot })
const renameStatus = await getStatus(git2, cloneRoot)
const renameEntry = renameStatus.staged.find((entry) => entry.path === 'README-renamed.md')
assert.equal(renameEntry?.oldPath, 'README.md')
assert.equal(renameEntry?.status, 'R')
await git2.run(['commit', '-m', 'test: rename readme'], { cwd: cloneRoot })
log('rename status', { path: renameEntry.path, oldPath: renameEntry.oldPath })

await git2.run(['checkout', 'main'], { cwd: cloneRoot })
await git2.run(['checkout', '-b', 'conflict/a'], { cwd: cloneRoot })
await writeFile(path.join(cloneRoot, 'app.js'), "export const app = 'conflict-a';\n")
await git2.run(['commit', '-am', 'test: conflict a'], { cwd: cloneRoot })
await git2.run(['checkout', 'main'], { cwd: cloneRoot })
await writeFile(path.join(cloneRoot, 'app.js'), "export const app = 'conflict-main';\n")
await git2.run(['commit', '-am', 'test: conflict main'], { cwd: cloneRoot })
let mergeFailed = false
try {
  await git2.run(['merge', 'conflict/a', '--no-edit'], { cwd: cloneRoot })
} catch {
  mergeFailed = true
}
assert.equal(mergeFailed, true)
const conflictStatus = await getStatus(git2, cloneRoot)
const conflictInfo = await repoInfo(git2, cloneRoot)
assert.ok(conflictStatus.conflicted.some((entry) => entry.path === 'app.js'))
assert.equal(conflictInfo.operation, 'merging')
log('conflict status', { path: 'app.js', operation: conflictInfo.operation })
await runAction(git2, cloneRoot, 'resolveConflict', { file: 'app.js', side: 'ours' })
const resolvedStatus = await getStatus(git2, cloneRoot)
assert.equal(resolvedStatus.conflicted.length, 0)
assert.equal((await repoInfo(git2, cloneRoot)).operation, 'merging')
log('conflict resolution', { resolved: 'app.js', staged: resolvedStatus.staged.length })
await git2.run(['merge', '--abort'], { cwd: cloneRoot })

// Selective (hunk-level) staging of one file with two separated hunks.
await git2.run(['reset', '--hard', 'HEAD'], { cwd: cloneRoot })
await writeFile(path.join(cloneRoot, 'app.js'), Array.from({ length: 20 }, (_, index) => `line ${index}`).join('\n') + '\n')
await git2.run(['commit', '-am', 'test: two-hunk base'], { cwd: cloneRoot })
const twoHunk = Array.from({ length: 20 }, (_, index) => `line ${index}`)
twoHunk[2] = 'line 2 changed'
twoHunk[17] = 'line 17 changed'
await writeFile(path.join(cloneRoot, 'app.js'), twoHunk.join('\n') + '\n')
const hunkDiff = await getDiff(git2, cloneRoot, { file: 'app.js' })
const hunkPlan = splitDiffHunks(hunkDiff.raw)
assert.equal(hunkPlan.hunks.length, 2)
assert.equal(hunkPlan.binary, false)
const stagedOne = await stageHunks(git2, cloneRoot, { file: 'app.js', mode: 'stage', hunks: [0] })
assert.equal(stagedOne.applied, 1)
const indexAfterStage = await getDiff(git2, cloneRoot, { file: 'app.js', cached: true })
assert.match(indexAfterStage.raw, /\+line 2 changed/)
assert.doesNotMatch(indexAfterStage.raw, /line 17 changed/)
const workAfterStage = await getDiff(git2, cloneRoot, { file: 'app.js' })
assert.match(workAfterStage.raw, /line 17 changed/)
assert.doesNotMatch(workAfterStage.raw, /line 2 changed/)
log('hunk staging', { staged: 1, remaining: 1 })
const unstagedOne = await stageHunks(git2, cloneRoot, { file: 'app.js', mode: 'unstage', hunks: [0] })
assert.equal(unstagedOne.applied, 1)
const indexAfterUnstage = await getDiff(git2, cloneRoot, { file: 'app.js', cached: true })
assert.equal(indexAfterUnstage.raw.trim(), '')
log('hunk unstaging', { restored: true })

// Fine-grained mode: nearby changes collapse into one hunk at context 3 and
// split into two stageable hunks at context 0.
await git2.run(['reset', '--hard', 'HEAD'], { cwd: cloneRoot })
await writeFile(path.join(cloneRoot, 'near.js'), Array.from({ length: 10 }, (_, index) => `line ${index}`).join('\n') + '\n')
await git2.run(['add', 'near.js'], { cwd: cloneRoot })
await git2.run(['commit', '-m', 'test: near-change base'], { cwd: cloneRoot })
const near = Array.from({ length: 10 }, (_, index) => `line ${index}`)
near[1] = 'line 1 changed'
near[3] = 'line 3 changed'
await writeFile(path.join(cloneRoot, 'near.js'), near.join('\n') + '\n')
const coarse = splitDiffHunks((await getDiff(git2, cloneRoot, { file: 'near.js', context: 3 })).raw)
const fine = splitDiffHunks((await getDiff(git2, cloneRoot, { file: 'near.js', context: 0 })).raw)
assert.equal(coarse.hunks.length, 1)
assert.equal(fine.hunks.length, 2)
const fineStage = await stageHunks(git2, cloneRoot, { file: 'near.js', mode: 'stage', hunks: [0], context: 0 })
assert.equal(fineStage.applied, 1)
const fineIndex = await getDiff(git2, cloneRoot, { file: 'near.js', cached: true, context: 0 })
assert.match(fineIndex.raw, /\+line 1 changed/)
assert.doesNotMatch(fineIndex.raw, /line 3 changed/)
const fineWork = await getDiff(git2, cloneRoot, { file: 'near.js', context: 0 })
assert.match(fineWork.raw, /line 3 changed/)
log('fine-grained staging', { coarse: 1, fine: 2, staged: 1 })

// Trailers: parse what git stores, and confirm a stamped commit round-trips.
await git2.run(['reset', '--hard', 'HEAD'], { cwd: cloneRoot })
const stampMessage = [
  'feat: trailer fixture',
  '',
  '',
  'Assisted-by: dsh/test-model (session abc123)',
  'Co-authored-by: Someone <someone@example.com>',
].join('\n')
await writeFile(path.join(cloneRoot, 'trailer.txt'), 'trailer fixture\n')
await git2.run(['add', 'trailer.txt'], { cwd: cloneRoot })
const stamped = await runAction(git2, cloneRoot, 'commit', { message: stampMessage })
assert.match(stamped.hash, /^[0-9a-f]+$/)
const stored = (await git2.run(['log', '-1', '--format=%(trailers)'], { cwd: cloneRoot })).stdout
assert.match(stored, /Assisted-by: dsh\/test-model \(session abc123\)/)
assert.match(stored, /Co-authored-by: Someone/)
const trailerDetail = await getCommitDetail(git2, cloneRoot, stamped.hash)
assert.deepEqual(trailerDetail.commit.trailers, [
  { key: 'Assisted-by', value: 'dsh/test-model (session abc123)' },
  { key: 'Co-authored-by', value: 'Someone <someone@example.com>' },
])
assert.match(trailerDetail.commit.subject, /trailer fixture/)
assert.equal(trailerDetail.commit.body.trim(), '')
log('trailer parsing', { count: trailerDetail.commit.trailers.length })

// A commit without trailers must yield an empty list, not a bogus entry.
await writeFile(path.join(cloneRoot, 'plain.txt'), 'plain fixture\n')
await git2.run(['add', 'plain.txt'], { cwd: cloneRoot })
const plain = await runAction(git2, cloneRoot, 'commit', { message: 'chore: no trailers here' })
const plainDetail = await getCommitDetail(git2, cloneRoot, plain.hash)
assert.deepEqual(plainDetail.commit.trailers, [])
log('trailer absence', { count: 0 })

// Panel commits are stamped with the attribution trailer exactly once.
const attribution = { key: 'Assisted-by', value: 'dsh/test/default (default-selection)' }
await writeFile(path.join(cloneRoot, 'stamped.txt'), 'stamped fixture\n')
await git2.run(['add', 'stamped.txt'], { cwd: cloneRoot })
const stampedByPanel = await runAction(git2, cloneRoot, 'commit', { message: 'feat: stamped by the panel', attribution })
const stampedTrailers = (await getCommitDetail(git2, cloneRoot, stampedByPanel.hash)).commit.trailers
assert.deepEqual(stampedTrailers, [attribution])
assert.equal((await getCommitDetail(git2, cloneRoot, stamped.hash)).commit.body.trim(), '')
// A message that already names the key is left alone.
await writeFile(path.join(cloneRoot, 'stamped2.txt'), 'stamped fixture 2\n')
await git2.run(['add', 'stamped2.txt'], { cwd: cloneRoot })
const own = await runAction(git2, cloneRoot, 'commit', {
  message: 'feat: own trailer\n\n\nAssisted-by: dsh/mine',
  attribution,
})
const ownTrailers = (await getCommitDetail(git2, cloneRoot, own.hash)).commit.trailers
assert.deepEqual(ownTrailers, [{ key: 'Assisted-by', value: 'dsh/mine' }])
log('panel stamping', { stamped: 1, respected: 1 })

await rm(clone, { recursive: true, force: true })
await rm(work, { recursive: true, force: true })
await rm(path.join(process.cwd(), '.tmp-runner'), { recursive: true, force: true })

console.log('\nAll smoke checks passed.')
