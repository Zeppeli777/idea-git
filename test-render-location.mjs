/**
 * Renderer check for the location quick-copy: diff line selection, the range
 * chip, and the clipboard text handed to the AI (diff, blame and menus).
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
  console.log('location UI check skipped: .tmp-test React test renderer is not installed')
  process.exit(0)
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true
const here = process.cwd()

// Six new-file lines, two of them changed, so line numbers are unambiguous.
const commitDiff = [
  'diff --git a/src/graph.js b/src/graph.js',
  'index 1111111..2222222 100644',
  '--- a/src/graph.js',
  '+++ b/src/graph.js',
  '@@ -1,6 +1,6 @@',
  ' export function layout() {',
  '-  return "old";',
  '+  return "new";',
  ' }',
  ' export const colors = ["blue"];',
  ' export const lanes = 2;',
  '',
].join('\n')
const blameLines = [
  { hash: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', author: 'Ada Lovelace', email: 'ada@example.com', time: 1700000000, summary: 'feat: initial', filename: 'README.md', origLine: 1, finalLine: 1, content: '# Demo' },
  { hash: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', author: 'Grace Hopper', email: 'grace@example.com', time: 1700100000, summary: 'docs: extend', filename: 'README.md', origLine: 2, finalLine: 2, content: 'More text' },
]
const repo = {
  root: 'C:/repo', name: 'repo', gitDir: 'C:/repo/.git', branch: 'main', head: '1f073153decb', shortHead: '1f073153',
  upstream: '', ahead: 0, behind: 0, detached: false, empty: false, commitCount: 6, userName: 'Ada',
  userEmail: 'ada@example.com', remotes: [], remote: '', remoteUrl: '', shallow: false, operation: null,
}
const commit = {
  hash: '1f073153decb', parents: ['577f0172'], authorName: 'Ada Lovelace', authorEmail: 'ada@example.com',
  authorTime: 1700000000, committerName: 'Ada Lovelace', committerEmail: 'ada@example.com',
  committerTime: 1700000000, decorations: 'HEAD -> main', subject: 'merge: feature/graph into main',
  trailers: [{ key: 'Assisted-by', value: 'dsh/test-model (session abc123)' }], body: '', isMerge: true,
}
const responses = {
  bootstrap: { workspaces: [{ id: 'w1', title: 'Demo', path: 'C:/repo', repos: ['C:/repo'] }], repo, gitVersion: 'git version 2.49.0', warning: '', attribution: { key: 'Assisted-by', value: 'dsh/p/m (default-selection)' } },
  repoInfo: { repo },
  refs: { local: [{ kind: 'local', name: 'main', hash: '1f073153', head: true, upstream: '', ahead: 0, behind: 0, date: 1700000000, subject: 'merge', annotated: false, remote: '', gone: false }], remote: [], tags: [], current: 'main', all: [] },
  log: { commits: [{ hash: '1f073153decb', parents: ['577f0172'], authorName: 'Ada', authorEmail: 'a@b.c', authorTime: 1700000000, committerName: 'Ada', committerEmail: 'a@b.c', committerTime: 1700000000, decorations: 'HEAD -> main', subject: 'merge: feature/graph into main', body: '' }], hasMore: false, nextSkip: 1 },
  status: { branch: 'main', head: 'aaaa', upstream: '', ahead: 0, behind: 0, detached: false, staged: [], unstaged: [], untracked: [], conflicted: [], ignored: 0 },
  stashes: { stashes: [] },
  files: { tracked: ['src/graph.js', 'README.md'], untracked: [], truncated: false, total: 2 },
  commit: { commit, base: '577f0172', files: [{ path: 'src/graph.js', oldPath: null, status: 'M', score: '', additions: 1, deletions: 1, binary: false }], filesTruncated: false, totalFiles: 1, totalAdditions: 1, totalDeletions: 1 },
  blame: { lines: blameLines, truncated: false, file: 'README.md', rev: 'HEAD' },
  action: { repo, output: '' },
}
const copied = []
globalThis.fetch = async (url, options) => {
  const body = JSON.parse(options.body)
  const value = body.method === 'diff'
    ? { raw: commitDiff, binary: false, truncated: false, file: 'src/graph.js' }
    : responses[body.method]
  if (!value) throw new Error(`no mock for ${body.method}`)
  return { ok: true, status: 200, json: async () => ({ ok: true, value, meta: { durationMs: 1, commands: [] } }) }
}
Object.defineProperty(globalThis, 'navigator', {
  value: { clipboard: { writeText: async (text) => { copied.push(String(text)) } } },
  configurable: true,
})

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
const fakeEvent = (extra) => ({
  currentTarget: { getBoundingClientRect: () => ({ left: 10, top: 10, right: 200, bottom: 34, width: 190, height: 24 }) },
  target: { getBoundingClientRect: () => ({ left: 10, top: 10, right: 200, bottom: 34, width: 190, height: 24 }) },
  clientX: 100,
  clientY: 30,
  shiftKey: false,
  preventDefault() {},
  stopPropagation() {},
  ...extra,
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

// Open the commit diff for src/graph.js.
await clickText('Open diff')
assert.match(visible(), /return/)
assert.match(visible(), /new/)
assert.match(visible(), /Copy location/)
assert.match(visible(), /Trailers/)
assert.match(visible(), /Assisted-by/)

// Click line 2 then shift-click line 4 → a range, shown as a chip.
const codeRows = () => renderer.root.findAll((entry) => entry.type === 'tr' && typeof entry.props.onClick === 'function')
assert.ok(codeRows().length >= 4, 'diff rows are clickable')
await TestRenderer.act(async () => {
  codeRows()[1].props.onClick(fakeEvent())
  await new Promise((resolve) => setTimeout(resolve, 120))
})
assert.match(visible(), /L2/)
await TestRenderer.act(async () => {
  codeRows()[3].props.onClick(fakeEvent({ shiftKey: true }))
  await new Promise((resolve) => setTimeout(resolve, 120))
})
assert.match(visible(), /L2-4/)

await clickText('Copy location')
assert.equal(copied.length, 1)
assert.equal(copied[0], 'src/graph.js:2-4 @ 1f073153')
console.log('diff location copy:', copied[0])

// Blame rows copy their own line and commit.
await clickText('Blame')
await clickText('README.md')
const blameCopy = renderer.root.findAll((entry) => entry.type === 'button' && String(entry.props.className || '').includes('ig-blame-copy'))
assert.ok(blameCopy.length >= 2, 'blame rows expose a copy button')
await TestRenderer.act(async () => {
  blameCopy[1].props.onClick(fakeEvent())
  await new Promise((resolve) => setTimeout(resolve, 250))
})
assert.equal(copied.length, 2)
assert.equal(copied[1], 'README.md:2 @ bbbbbbbb')
console.log('blame location copy:', copied[1])

// The file menu's Copy location carries the commit hash.
await clickText('Log')
const fileMenuButton = renderer.root.findAll((entry) => entry.type === 'button' && textOf(entry).includes('graph.js'))[0]
assert.ok(fileMenuButton, 'file tree row')
await TestRenderer.act(async () => {
  fileMenuButton.props.onContextMenu(fakeEvent())
  await new Promise((resolve) => setTimeout(resolve, 250))
})
const menuItem = renderer.root.findAll((entry) => entry.type === 'button' && String(entry.props.className || '').includes('ig-menu-item') && textOf(entry).includes('Copy location'))[0]
assert.ok(menuItem, 'Copy location menu item')
await TestRenderer.act(async () => {
  menuItem.props.onClick(fakeEvent())
  await new Promise((resolve) => setTimeout(resolve, 250))
})
assert.equal(copied.length, 3)
assert.equal(copied[2], 'src/graph.js @ 1f073153')
console.log('menu location copy:', copied[2])

console.log('location UI check passed')
