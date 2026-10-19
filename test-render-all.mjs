/**
 * Whole-workbench regression render check.
 *
 * Exercises every tab, the diff overlay, the compare dialog and the rebase
 * planner against real repository data served by a mocked Host.
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
  console.log('workbench render check skipped: .tmp-test React test renderer is not installed')
  process.exit(0)
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true
const here = process.cwd()
const repoPath = path.join(here, '..', 'idea-git-demo')
const { createRunner } = await import('./git-core.js')
const {
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
} = await import('./git-core.js')

const runner = createRunner({ cwd: here })
const root = await resolveRepo(runner, repoPath)
const info = await repoInfo(runner, root)
const refs = await getRefs(runner, root)
const status = await getStatus(runner, root)
const stashes = await getStashes(runner, root)
const logValue = await getLog(runner, root, { all: true, limit: 100 })
const selected = logValue.commits.find((commit) => commit.parents.length > 1) || logValue.commits[0]
const detail = await getCommitDetail(runner, root, selected.hash)

const responses = {
  bootstrap: { workspaces: [{ id: 'w1', title: 'Demo', path: root, repos: [root] }], repo: info, gitVersion: 'git version 2.49.0', warning: '' },
  repoInfo: { repo: info },
  refs,
  status,
  stashes,
  log: logValue,
  commit: detail,
  files: await getFiles(runner, root),
  fileHistory: await getFileHistory(runner, root, { file: 'src/graph.js' }),
  blame: await getBlame(runner, root, { file: 'README.md', rev: 'HEAD' }),
  compare: await getCompare(runner, root, { base: 'feature/graph', target: 'main' }),
  action: { repo: info, output: '' },
}
const calls = []
globalThis.fetch = async (url, options) => {
  const body = JSON.parse(options.body)
  calls.push(body)
  const value = body.method === 'diff'
    ? await getDiff(runner, root, body.params || {})
    : responses[body.method]
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
  await new Promise((resolve) => setTimeout(resolve, 800))
})

async function clickText(label) {
  const node = renderer.root.findAll((entry) => (entry.type === 'button' || typeof entry.props?.onClick === 'function') && !entry.props.disabled && textOf(entry).includes(label))[0]
  assert.ok(node, `clickable not found: ${label}`)
  await TestRenderer.act(async () => {
    node.props.onClick(fakeEvent())
    await new Promise((resolve) => setTimeout(resolve, 450))
  })
}
async function clickAria(label) {
  const node = renderer.root.findAll((entry) => entry.type === 'button' && entry.props['aria-label'] === label)[0]
  assert.ok(node, `aria button not found: ${label}`)
  await TestRenderer.act(async () => {
    node.props.onClick(fakeEvent())
    await new Promise((resolve) => setTimeout(resolve, 450))
  })
}

// Log tab: graph rows, ref badges, details and the diff overlay.
assert.match(visible(), /Git workbench/)
assert.match(visible(), /merge: feature\/graph into main/)
assert.match(visible(), /feat\(graph\): lay out commit lanes/)
assert.match(visible(), /graph\.js/)
assert.match(visible(), /HEAD/)

// The hash is copyable exactly once: the inline chip button. A second
// "Copy hash" text button in the details footer would be redundant.
const copyHashChips = renderer.root.findAll((node) => node.type === 'button' && node.props['aria-label'] === 'Copy hash')
const copyHashButtons = renderer.root.findAll((node) => node.type === 'button' && textOf(node).trim() === 'Copy hash')
assert.equal(copyHashChips.length, 1, 'one inline hash-copy button')
assert.equal(copyHashButtons.length, 0, 'no redundant Copy hash button in the details footer')
// "More" is offered once in the details header, not twice.
const moreButtons = renderer.root.findAll((node) => node.type === 'button' && textOf(node).trim() === 'More')
assert.equal(moreButtons.length, 1, 'one More button in commit details')

await clickText('Open diff')
assert.match(visible(), /export function layout/)
assert.match(visible(), /Split/)
// A commit diff must not offer hunk staging.
assert.doesNotMatch(visible(), /Stage selected hunks/)
await clickAria('Close')

// Local Changes.
await clickText('Local Changes')
assert.match(visible(), /staged\.txt|README\.md/)

// File History.
await clickText('File History')
assert.match(visible(), /Select a file to see its history/)
await clickText('graph.js')
assert.match(visible(), /color branch lanes|lay out commit lanes/)

// Blame.
await clickText('Blame')
await clickText('README.md')
assert.match(visible(), /Ada Lovelace/)

// Stash.
await clickText('Stash')
assert.match(visible(), /wip: readme polish/)

// Console.
await clickText('Console')
assert.match(visible(), /Console \d+/)

// Compare dialog from a branch row.
await clickText('Log')
const branchRow = renderer.root.findAll((entry) => String(entry.props?.className || '').includes('ig-ref-row') && textOf(entry).includes('feature/graph'))[0]
assert.ok(branchRow, 'branch row')
await TestRenderer.act(async () => {
  branchRow.props.onContextMenu(fakeEvent())
  await new Promise((resolve) => setTimeout(resolve, 250))
})
const compareItem = renderer.root.findAll((entry) => entry.type === 'button' && String(entry.props.className || '').includes('ig-menu-item') && textOf(entry).includes('Compare with current'))[0]
assert.ok(compareItem, 'compare menu item')
await TestRenderer.act(async () => {
  compareItem.props.onClick(fakeEvent())
  await new Promise((resolve) => setTimeout(resolve, 500))
})
assert.match(visible(), /Compare with current/)
assert.match(visible(), /README\.md/)
await clickText('Close')

// Rebase planner from the header menu.
await clickAria('More')
const rebaseItem = renderer.root.findAll((entry) => entry.type === 'button' && String(entry.props.className || '').includes('ig-menu-item') && textOf(entry).includes('Interactive rebase'))[0]
assert.ok(rebaseItem, 'rebase menu item')
await TestRenderer.act(async () => {
  rebaseItem.props.onClick(fakeEvent())
  await new Promise((resolve) => setTimeout(resolve, 600))
})
assert.match(visible(), /Interactive rebase/)
assert.match(visible(), /No commits to rebase|Pick/)

console.log('workbench regression check passed')
console.log('rpc methods:', [...new Set(calls.map((entry) => entry.method))].join(', '))
