/**
 * Exercise the real Host route (JSON-RPC envelope, auth fence, workspace scan,
 * dispatch, production execFile runner) without a browser.
 */
import assert from 'node:assert/strict'
import { cp, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createRunner, resolveRepo } from './git-core.js'
import { apply } from './index.js'

const root = path.join(process.cwd(), '..', 'idea-git-demo')
/** Live agents whose shape mirrors the confirmed Harness Agent object. */
const makeAgents = (entries) => entries.map((entry) => ({
  id: entry.id,
  options: { provider: entry.provider, model: entry.model },
  session: { header: { cwd: entry.cwd } },
}))
const routes = new Map()
const sections = []
const ctx = {
  effect(callback) { return callback() },
  webServer: {
    register(route) {
      routes.set(route.path, route)
      return () => {}
    },
  },
  connection: {
    requestRejection() { return undefined },
  },
  workspaceRegistry: {
    list() { return [{ id: 'w1', title: 'Demo workspace', path: root }] },
  },
  agents: {
    list() {
      return makeAgents([
        { id: 'session-live-1', provider: 'magpie', model: 'stepfun-cn/step-5-preview', cwd: root },
      ])
    },
  },
  agentDefaultModel: {
    currentSelection() { return { provider: 'test-provider', model: 'test-model', reasoningEffort: 'max' } },
  },
  systemPrompt: {
    section(section) {
      sections.push(section)
      return () => {}
    },
  },
}
apply(ctx, { stampAttribution: true, agentCommitHint: true, attributionKey: 'Assisted-by' })
assert.ok(routes.has('/idea-git/rpc'))
assert.ok(routes.has('/idea-git/ping'))
assert.equal(sections.length, 1, 'the attribution prompt section is registered')
assert.equal(sections[0].name, 'idea-git:commit-attribution')
assert.match(sections[0].text, /Assisted-by: dsh\//)

function request(method, body) {
  return {
    method,
    headers: { 'content-type': 'application/json' },
    async *[Symbol.asyncIterator]() {
      if (body !== undefined) yield Buffer.from(JSON.stringify(body))
    },
  }
}

function response() {
  let resolve
  const done = new Promise((res) => { resolve = res })
  return {
    statusCode: 0,
    headers: {},
    body: '',
    setHeader(key, value) { this.headers[key.toLowerCase()] = value },
    end(body) {
      this.body = body ? String(body) : ''
      resolve()
    },
    done,
  }
}

async function call(route, req) {
  const res = response()
  await route.handler(req, res)
  await res.done
  return { status: res.statusCode, json: res.body ? JSON.parse(res.body) : null }
}

const ping = await call(routes.get('/idea-git/ping'), { method: 'GET', headers: {} })
assert.equal(ping.status, 200)
assert.equal(ping.json.ok, true)

const bootstrap = await call(routes.get('/idea-git/rpc'), request('POST', { method: 'bootstrap', params: { repoPath: root } }))
assert.equal(bootstrap.status, 200)
assert.equal(bootstrap.json.ok, true, JSON.stringify(bootstrap.json))
assert.equal(bootstrap.json.value.repo.branch, 'main')
assert.ok(bootstrap.json.value.workspaces[0].repos.length >= 1)
assert.match(bootstrap.json.value.gitVersion, /git version/)
console.log('✓ bootstrap', bootstrap.json.value.repo.branch, bootstrap.json.meta.commands.length, 'commands')

const log = await call(routes.get('/idea-git/rpc'), request('POST', { method: 'log', params: { repo: root, all: true, limit: 100 } }))
assert.equal(log.json.ok, true, JSON.stringify(log.json))
assert.ok(log.json.value.commits.length >= 6, 'log returns the history')
const merge = log.json.value.commits.find((commit) => commit.parents.length > 1)
assert.ok(merge)
console.log('✓ log', log.json.value.commits.length, 'commits')

const commit = await call(routes.get('/idea-git/rpc'), request('POST', { method: 'commit', params: { repo: root, hash: merge.hash } }))
assert.equal(commit.json.ok, true, JSON.stringify(commit.json))
assert.ok(commit.json.value.files.some((file) => file.path === 'src/graph.js'))
console.log('✓ commit', commit.json.value.files.length, 'files')

const status = await call(routes.get('/idea-git/rpc'), request('POST', { method: 'status', params: { repo: root } }))
assert.equal(status.json.ok, true)
// The demo repository's working tree is whatever the user last did, so only
// assert the envelope shape here; the engine test covers a known dirty state.
assert.ok(Array.isArray(status.json.value.staged))
assert.ok(Array.isArray(status.json.value.untracked))
assert.equal(typeof status.json.value.branch, 'string')
console.log('✓ status', { branch: status.json.value.branch, staged: status.json.value.staged.length })

const diff = await call(routes.get('/idea-git/rpc'), request('POST', { method: 'diff', params: { repo: root, hash: merge.hash, file: 'src/graph.js' } }))
assert.equal(diff.json.ok, true, JSON.stringify(diff.json))
assert.match(diff.json.value.raw, /export function layout/)
console.log('✓ diff', diff.json.value.raw.length, 'bytes')

const blame = await call(routes.get('/idea-git/rpc'), request('POST', { method: 'blame', params: { repo: root, file: 'README.md', rev: 'HEAD' } }))
assert.equal(blame.json.ok, true, JSON.stringify(blame.json))
assert.ok(blame.json.value.lines.length >= 4)
console.log('✓ blame', blame.json.value.lines.length, 'lines')

const compare = await call(routes.get('/idea-git/rpc'), request('POST', { method: 'compare', params: { repo: root, base: 'feature/graph', target: 'main' } }))
assert.equal(compare.json.ok, true, JSON.stringify(compare.json))
assert.ok(compare.json.value.files.some((file) => file.path === 'README.md'))
console.log('✓ compare', compare.json.value.files.length, 'files')

const tag = await call(routes.get('/idea-git/rpc'), request('POST', { method: 'action', params: { repo: root, action: 'tagCreate', name: 'test/auto-tag', ref: merge.hash, message: 'automated test tag' } }))
assert.equal(tag.json.ok, true, JSON.stringify(tag.json))
const refsAfterTag = await call(routes.get('/idea-git/rpc'), request('POST', { method: 'refs', params: { repo: root } }))
assert.ok(refsAfterTag.json.value.tags.some((entry) => entry.name === 'test/auto-tag'))
const cleanup = createRunner()
await cleanup.run(['tag', '-d', 'test/auto-tag'], { cwd: root })
console.log('✓ tag action')

const bad = await call(routes.get('/idea-git/rpc'), request('POST', { method: 'nope', params: {} }))
assert.equal(bad.json.ok, false)
assert.equal(bad.json.error.code, 'unknown-method')

const invalidRepo = await call(routes.get('/idea-git/rpc'), request('POST', { method: 'status', params: { repo: path.join(root, 'does-not-exist') } }))
assert.equal(invalidRepo.json.ok, false)
assert.equal(invalidRepo.json.error.code, 'repository-not-found')
console.log('✓ error envelopes')

const rejectedCtx = {
  ...ctx,
  connection: { requestRejection() { return 401 } },
}
const rejectedRoutes = new Map()
rejectedCtx.webServer = { register(route) { rejectedRoutes.set(route.path, route); return () => {} } }
apply(rejectedCtx)
const rejected = await call(rejectedRoutes.get('/idea-git/ping'), { method: 'GET', headers: {} })
assert.equal(rejected.status, 401)
console.log('✓ auth fence')

// End-to-end stamping through the route: dispatch → attribution → git.
// The live agent for this repo wins over the default-selection fallback.
const stampRoot = path.join(process.cwd(), '..', '.tmp-route-stamp')
await rm(stampRoot, { recursive: true, force: true })
await cp(root, stampRoot, { recursive: true, force: true })
const stampGit = createRunner()
const stampRepo = await resolveRepo(stampGit, stampRoot)
await stampGit.run(['reset', '--hard', 'HEAD'], { cwd: stampRepo })
await writeFile(path.join(stampRepo, 'stamped.txt'), 'route stamp fixture\n')
await stampGit.run(['add', 'stamped.txt'], { cwd: stampRepo })
const stamped = await call(routes.get('/idea-git/rpc'), request('POST', {
  method: 'action',
  params: { repo: stampRoot, action: 'commit', message: 'feat: stamped through the route' },
}))
assert.equal(stamped.json.ok, true, JSON.stringify(stamped.json))
const stored = (await stampGit.run(['log', '-1', '--format=%(trailers)'], { cwd: stampRepo })).stdout
assert.match(stored, /Assisted-by: dsh\/magpie\/stepfun-cn\/step-5-preview \(session session-live-1\)/)
assert.doesNotMatch(stored, /default-selection/)
console.log('✓ route stamping (live agent)')

// Fallback: no agent knows this repo, so the default selection is used and labelled.
const orphanRoot = path.join(process.cwd(), '..', '.tmp-route-orphan')
await rm(orphanRoot, { recursive: true, force: true })
await cp(root, orphanRoot, { recursive: true, force: true })
const orphanGit = createRunner()
const orphanRepo = await resolveRepo(orphanGit, orphanRoot)
await orphanGit.run(['reset', '--hard', 'HEAD'], { cwd: orphanRepo })
await writeFile(path.join(orphanRepo, 'orphan.txt'), 'orphan fixture\n')
await orphanGit.run(['add', 'orphan.txt'], { cwd: orphanRepo })
const orphanCtx = { ...ctx, agents: { list: () => [] } }
const orphanRoutes = new Map()
orphanCtx.webServer = { register(route) { orphanRoutes.set(route.path, route); return () => {} } }
apply(orphanCtx, { stampAttribution: true, agentCommitHint: true, attributionKey: 'Assisted-by' })
const orphaned = await call(orphanRoutes.get('/idea-git/rpc'), request('POST', {
  method: 'action',
  params: { repo: orphanRoot, action: 'commit', message: 'feat: orphan commit' },
}))
assert.equal(orphaned.json.ok, true, JSON.stringify(orphaned.json))
const orphanStored = (await orphanGit.run(['log', '-1', '--format=%(trailers)'], { cwd: orphanRepo })).stdout
assert.match(orphanStored, /Assisted-by: dsh\/test-provider\/test-model \(default-selection\)/)
console.log('✓ route stamping (default-selection fallback)')

// Two distinct agents in the repo produce two trailer lines, capped at three.
const multiRoot = path.join(process.cwd(), '..', '.tmp-route-multi')
await rm(multiRoot, { recursive: true, force: true })
await cp(root, multiRoot, { recursive: true, force: true })
const multiGit = createRunner()
const multiRepo = await resolveRepo(multiGit, multiRoot)
await multiGit.run(['reset', '--hard', 'HEAD'], { cwd: multiRepo })
await writeFile(path.join(multiRepo, 'multi.txt'), 'multi fixture\n')
await multiGit.run(['add', 'multi.txt'], { cwd: multiRepo })
const multiCtx = {
  ...ctx,
  agents: {
    list: () => makeAgents([
      { id: 'session-a', provider: 'magpie', model: 'model-a', cwd: multiRoot },
      { id: 'session-b', provider: 'magpie', model: 'model-b', cwd: multiRoot },
      { id: 'session-c', provider: 'other', model: 'model-c', cwd: multiRoot },
      { id: 'session-d', provider: 'other', model: 'model-d', cwd: multiRoot },
    ]),
  },
}
const multiRoutes = new Map()
multiCtx.webServer = { register(route) { multiRoutes.set(route.path, route); return () => {} } }
apply(multiCtx, { stampAttribution: true, agentCommitHint: true, attributionKey: 'Assisted-by' })
const multi = await call(multiRoutes.get('/idea-git/rpc'), request('POST', {
  method: 'action',
  params: { repo: multiRoot, action: 'commit', message: 'feat: multi-agent commit' },
}))
assert.equal(multi.json.ok, true, JSON.stringify(multi.json))
const multiStored = (await multiGit.run(['log', '-1', '--format=%(trailers)'], { cwd: multiRepo })).stdout
assert.match(multiStored, /Assisted-by: dsh\/magpie\/model-a \(session session-a\)/)
assert.match(multiStored, /Assisted-by: dsh\/magpie\/model-b \(session session-b\)/)
assert.match(multiStored, /Assisted-by: dsh\/other\/model-c \(session session-c\)/)
assert.doesNotMatch(multiStored, /model-d/)
console.log('✓ route stamping (multi-agent, capped)')

for (const dir of [stampRoot, orphanRoot, multiRoot]) {
  await rm(dir, { recursive: true, force: true })
}

console.log('\nhost route checks passed')
