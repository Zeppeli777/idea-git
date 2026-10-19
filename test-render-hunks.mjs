/**
 * Renderer check for selective (hunk-level) staging in the diff viewer,
 * including the fine-grained (zero-context) mode that splits nearby changes
 * into separately stageable hunks.
 *
 * Requires the dev-only React test renderer:
 *   npm install --no-save --prefix .tmp-test react@18.3.1 react-test-renderer@18.3.1
 * Without it this check prints a notice and exits successfully.
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

let React
let TestRenderer
try {
  React = (await import('./.tmp-test/node_modules/react/index.js')).default
  TestRenderer = (await import('./.tmp-test/node_modules/react-test-renderer/index.js')).default
} catch {
  console.log('hunk UI check skipped: .tmp-test React test renderer is not installed')
  process.exit(0)
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true
const here = process.cwd()

// Two changes two lines apart: one hunk at context 3, two hunks at context 0.
const nearChanges = [
  ' line 0',
  '-line 1',
  '+line 1 changed',
  ' line 2',
  '-line 3',
  '+line 3 changed',
  ' line 4',
  ' line 5',
  ' line 6',
]
const worktreeDiff3 = [
  'diff --git a/app.js b/app.js',
  'index 1111111..2222222 100644',
  '--- a/app.js',
  '+++ b/app.js',
  '@@ -1,9 +1,9 @@',
  ...nearChanges,
  '',
].join('\n')
const worktreeDiff0 = [
  'diff --git a/app.js b/app.js',
  'index 1111111..2222222 100644',
  '--- a/app.js',
  '+++ b/app.js',
  '@@ -2 +2 @@ line 0',
  '-line 1',
  '+line 1 changed',
  '@@ -4 +4 @@ line 2',
  '-line 3',
  '+line 3 changed',
  '',
].join('\n')
const indexDiff3 = worktreeDiff3.replace('line 1 changed', 'line 1 staged').replace('line 3 changed', 'line 3 staged')
const indexDiff0 = worktreeDiff0.replace('line 1 changed', 'line 1 staged').replace('line 3 changed', 'line 3 staged')

const status = {
  branch: 'main',
  head: 'aaaa',
  upstream: '',
  ahead: 0,
  behind: 0,
  detached: false,
  staged: [{ path: 'app.js', oldPath: null, xy: 'MM', status: 'M', side: 'staged' }],
  unstaged: [{ path: 'app.js', oldPath: null, xy: 'MM', status: 'M', side: 'unstaged' }],
  untracked: [],
  conflicted: [],
  ignored: 0,
}
const repo = {
  root: 'C:/repo',
  name: 'repo',
  gitDir: 'C:/repo/.git',
  branch: 'main',
  head: 'aaaa',
  shortHead: 'aaaaaaa',
  upstream: '',
  ahead: 0,
  behind: 0,
  detached: false,
  empty: false,
  commitCount: 6,
  userName: 'Ada',
  userEmail: 'ada@example.com',
  remotes: [],
  remote: '',
  remoteUrl: '',
  shallow: false,
  operation: null,
}
const calls = []
const responses = {
  bootstrap: { workspaces: [{ id: 'w1', title: 'Demo', path: 'C:/repo', repos: ['C:/repo'] }], repo, gitVersion: 'git version 2.49.0', warning: '' },
  repoInfo: { repo },
  refs: { local: [], remote: [], tags: [], current: 'main', all: [] },
  log: { commits: [], hasMore: false, nextSkip: 0 },
  status,
  stashes: { stashes: [] },
  files: { tracked: ['app.js'], untracked: [], truncated: false, total: 1 },
  commit: { commit: { hash: 'aaaa', parents: [], authorName: 'Ada', authorEmail: 'a@b.c', authorTime: 1700000000, committerName: 'Ada', committerEmail: 'a@b.c', committerTime: 1700000000, decorations: '', subject: 'x', body: '', isMerge: false }, base: '', files: [], filesTruncated: false, totalFiles: 0, totalAdditions: 0, totalDeletions: 0 },
}
globalThis.fetch = async (url, options) => {
  const body = JSON.parse(options.body)
  calls.push(body)
  let value
  if (body.method === 'diff') {
    const zero = body.params?.context === 0
    value = body.params?.cached
      ? { raw: zero ? indexDiff0 : indexDiff3, binary: false, truncated: false, file: 'app.js' }
      : { raw: zero ? worktreeDiff0 : worktreeDiff3, binary: false, truncated: false, file: 'app.js' }
  } else if (body.method === 'stageHunks') {
    value = { applied: body.params.hunks.length, mode: body.params.mode, total: body.params.context === 0 ? 2 : 1, file: 'app.js' }
  } else if (body.method === 'action') {
    value = { repo, output: '' }
  } else {
    value = responses[body.method]
  }
  if (!value) throw new Error(`no mock for ${body.method}`)
  return { ok: true, status: 200, json: async () => ({ ok: true, value, meta: { durationMs: 1, commands: [] } }) }
}

const store = new Map()
globalThis.window = {
  __ModuleLoader__: { load(definition) { globalThis.__bootstrap = definition } },
  innerWidth: 1440,
  innerHeight: 900,
  localStorage: { getItem: (key) => store.get(key) ?? null, setItem: (key, value) => store.set(key, String(value)) },
  addEventListener() {},
  removeEventListener() {},
  open() {},
}
globalThis.localStorage = globalThis.window.localStorage
globalThis.document = { addEventListener() {}, createElement() { return {} } }

vm.runInThisContext(readFileSync(path.join(here, 'client.js'), 'utf8'), { filename: 'client.js' })
const plugin = globalThis.__bootstrap.factory(() => React)
let workbench
plugin.apply({
  locale: { bind() { return (key) => key }, register() { return () => {} }, subscribe() { return () => {} } },
  get() {},
  effect(callback) { return callback() },
  slots: {
    inject(key, callback) { callback() },
    register(options, component) { if (options.name === 'main') workbench = component; return () => {} },
  },
})

const visible = () => {
  const walk = (node) => {
    if (typeof node === 'string') return node
    if (!node || !Array.isArray(node.children)) return ''
    if (node.type === 'style') return ''
    return node.children.map(walk).filter(Boolean).join(' ')
  }
  return walk(renderer.toJSON()).replace(/\s+/g, ' ')
}
const textOf = (node) => {
  const parts = []
  const walk = (value) => {
    if (typeof value === 'string') parts.push(value)
    else if (value && Array.isArray(value.children)) value.children.forEach(walk)
  }
  walk(node)
  return parts.join(' ')
}
const fakeEvent = () => ({
  currentTarget: { getBoundingClientRect: () => ({ left: 10, top: 10, right: 200, bottom: 34, width: 190, height: 24 }) },
  target: { getBoundingClientRect: () => ({ left: 10, top: 10, right: 200, bottom: 34, width: 190, height: 24 }) },
  clientX: 100,
  clientY: 30,
  preventDefault() {},
  stopPropagation() {},
})

let renderer
await TestRenderer.act(async () => {
  renderer = TestRenderer.create(React.createElement(workbench))
  await new Promise((resolve) => setTimeout(resolve, 700))
})

async function clickText(label) {
  const node = renderer.root.findAll((entry) => (entry.type === 'button' || typeof entry.props?.onClick === 'function') && !entry.props.disabled && textOf(entry).includes(label))[0]
  assert.ok(node, `clickable not found: ${label}`)
  await TestRenderer.act(async () => {
    node.props.onClick(fakeEvent())
    await new Promise((resolve) => setTimeout(resolve, 450))
  })
}
const hunkBoxes = () => renderer.root.findAll((entry) => entry.type === 'input' && entry.props.type === 'checkbox' && String(entry.props['aria-label'] || '').startsWith('Select hunk'))
const changeRows = () => renderer.root.findAll((entry) => String(entry.props?.className || '').includes('ig-change-row'))

// Coarse mode: the two nearby changes are a single hunk.
await clickText('Local Changes')
await TestRenderer.act(async () => {
  changeRows()[1].props.onClick(fakeEvent())
  await new Promise((resolve) => setTimeout(resolve, 450))
})
assert.match(visible(), /line 1 changed/)
assert.match(visible(), /line 3 changed/)
assert.equal(hunkBoxes().length, 1, 'one hunk at context 3')
const diffCalls = () => calls.filter((entry) => entry.method === 'diff')
assert.equal(diffCalls()[diffCalls().length - 1].params.context, 3)

// Fine-grained mode re-fetches with context 0 and splits the hunk in two.
await clickText('Fine-grained hunks')
assert.equal(hunkBoxes().length, 2, 'two hunks at context 0')
assert.equal(diffCalls()[diffCalls().length - 1].params.context, 0)

// Stage only the first fine-grained hunk.
await TestRenderer.act(async () => {
  hunkBoxes()[0].props.onChange({ target: { checked: true } })
  await new Promise((resolve) => setTimeout(resolve, 150))
})
await clickText('Stage selected hunks')
const stageCall = calls.filter((entry) => entry.method === 'stageHunks' && entry.params.mode === 'stage')
assert.equal(stageCall.length, 1)
assert.deepEqual(stageCall[0].params.hunks, [0])
assert.equal(stageCall[0].params.context, 0, 'stageHunks uses the same context as the diff')

// Unstage flow on the index diff also honours the mode.
await TestRenderer.act(async () => {
  changeRows()[0].props.onClick(fakeEvent())
  await new Promise((resolve) => setTimeout(resolve, 450))
})
assert.equal(hunkBoxes().length, 2, 'index diff is also fine-grained')
await TestRenderer.act(async () => {
  hunkBoxes()[1].props.onChange({ target: { checked: true } })
  await new Promise((resolve) => setTimeout(resolve, 150))
})
await clickText('Unstage selected hunks')
const unstageCall = calls.filter((entry) => entry.method === 'stageHunks' && entry.params.mode === 'unstage')
assert.equal(unstageCall.length, 1)
assert.deepEqual(unstageCall[0].params.hunks, [1])
assert.equal(unstageCall[0].params.context, 0)

// The mode is persisted for the next session.
assert.match(store.get('idea-git.ui.v1') || '', /"diffContext":0/)

console.log('hunk staging UI check passed')
console.log('stageHunks calls:', calls.filter((entry) => entry.method === 'stageHunks').map((entry) => `${entry.params.mode}:ctx${entry.params.context}:${entry.params.hunks.join('|')}`).join(', '))
