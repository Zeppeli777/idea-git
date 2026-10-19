/**
 * Load the browser bundle in Node with a tiny React stub to catch top-level
 * reference errors and verify the slot/locale registrations. This is not a
 * rendering test; the Harness page is the rendering authority.
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const here = path.dirname(fileURLToPath(import.meta.url))
const source = readFileSync(path.join(here, 'client.js'), 'utf8')
let bootstrap
class FakeComponent {
  constructor(props) { this.props = props }
}
const React = {
  Component: FakeComponent,
  createElement(type, props, ...children) { return { type, props, children } },
  createContext(value) { return { value, Provider: function Provider() {} } },
  useState(value) { return [typeof value === 'function' ? value() : value, () => {}] },
  useEffect() {},
  useMemo(factory) { return factory() },
  useCallback(fn) { return fn },
  useRef(value) { return { current: value } },
  useReducer(_reducer, initial) { return [initial, () => {}] },
  useContext(context) { return context.value },
}
const sandbox = {
  window: {
    __ModuleLoader__: {
      load(definition) { bootstrap = definition },
    },
    addEventListener() {},
    removeEventListener() {},
    innerWidth: 1400,
    innerHeight: 900,
    localStorage: { getItem() { return null }, setItem() {} },
    open() {},
  },
  console,
  navigator: { clipboard: { writeText: async () => {} } },
  document: {},
  setTimeout,
  clearTimeout,
  fetch: async () => { throw new Error('network disabled in load test') },
  Intl,
  Date,
  Math,
  JSON,
  Object,
  Array,
  Set,
  Map,
  Uint16Array,
  URL,
  globalThis: null,
}
sandbox.globalThis = sandbox
vm.createContext(sandbox)
vm.runInContext(source, sandbox, { filename: 'client.js' })
assert.ok(bootstrap, 'bundle registered')
assert.equal(bootstrap.id, '@local/idea-git')
const plugin = bootstrap.factory((name) => {
  assert.equal(name, 'react')
  return React
})
assert.ok(plugin && typeof plugin.apply === 'function')
assert.equal(JSON.stringify(plugin.inject), JSON.stringify(['slots', 'locale']))

const registrations = []
const effects = []
const ctx = {
  locale: {
    register(namespace, locale, dictionary) {
      registrations.push({ kind: 'locale', namespace, locale, keys: Object.keys(dictionary).length })
      return () => {}
    },
    bind(namespace) {
      assert.equal(namespace, 'idea-git')
      return (key) => key
    },
    subscribe() { return () => {} },
  },
  get() { return undefined },
  effect(callback, label) {
    effects.push(label)
    return callback()
  },
  slots: {
    inject(key, callback) {
      registrations.push({ kind: 'inject', key })
      callback()
      return () => {}
    },
    register(options, component) {
      registrations.push({ kind: 'slot', options, component })
      return () => {}
    },
  },
}
plugin.apply(ctx)
console.log(JSON.stringify(registrations, (key, value) => (typeof value === 'function' ? `[fn:${value.name}]` : value), 2))
assert.equal(registrations.filter((entry) => entry.kind === 'locale').length, 2)
assert.equal(registrations.filter((entry) => entry.kind === 'slot').length, 2)
const sidebar = registrations.find((entry) => entry.kind === 'slot' && entry.options.name === 'sidebar.panellist')
const main = registrations.find((entry) => entry.kind === 'slot' && entry.options.name === 'main')
assert.equal(sidebar.options.id, 'git')
assert.equal(sidebar.options.label(), 'Git')
assert.equal(main.options.key, 'git')
assert.equal(typeof main.component, 'function')
console.log('\nclient registration checks passed')
