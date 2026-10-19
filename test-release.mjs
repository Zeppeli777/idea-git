/**
 * Release checklist for the IDEA Git bundle.
 *
 * Verifies everything a consumer or the Plugin Manager reads without
 * activating the plugin: manifest shape, declared files, locale metadata,
 * icon bytes, patch structure, and JavaScript syntax.
 */
import assert from 'node:assert/strict'
import { readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const here = process.cwd()
const read = (relative) => readFileSync(path.join(here, relative), 'utf8')
const ok = (label, detail) => console.log(`✓ ${label}${detail === undefined ? '' : `: ${detail}`}`)

// --- manifest ------------------------------------------------------------
const pkg = JSON.parse(read('package.json'))
assert.equal(pkg.name, '@local/idea-git')
assert.equal(pkg.version, '1.0.0')
assert.equal(pkg.type, 'module')
assert.ok(pkg.description && pkg.description.length > 40, 'description is meaningful')
assert.ok(pkg.exports['.'], 'Host entry exported')
assert.ok(pkg.exports['./client'], 'Client entry exported')
assert.ok(pkg.exports['./locale/*.json'], 'locale exported')
assert.ok(pkg.exports['./icon'], 'icon exported')
assert.equal(typeof pkg.dsh.bundle.patch, 'string', 'bundle patch path declared')
assert.ok(pkg.dsh.bundle.patch.endsWith('.yml'), 'bundle patch is a YAML file')
assert.equal(pkg.dsh.client.platform, 'web')
assert.equal(pkg.dsh.client.immediately, true)
assert.ok(pkg.dsh.client.inject.length >= 4, 'client dependencies declared')
ok('manifest', `v${pkg.version}, ${pkg.exports ? Object.keys(pkg.exports).length : 0} exports`)

// --- declared files all exist -------------------------------------------
for (const entry of pkg.files) {
  if (entry.includes('*')) {
    assert.ok(entry.startsWith('locale/') || entry.startsWith('test-'), `unexpected glob ${entry}`)
    const hits = entry === 'locale/*.json'
      ? ['en.json', 'zh.json']
      : ['test-client-load.mjs', 'test-host-route.mjs', 'test-rebase.mjs', 'test-render-all.mjs', 'test-render-hunks.mjs', 'test-render-location.mjs', 'test-smoke.mjs', 'test-runner.mjs']
    for (const hit of hits) {
      statSync(path.join(here, path.dirname(entry), hit))
    }
  } else {
    statSync(path.join(here, entry))
  }
}
ok('declared files', `${pkg.files.length} entries present`)

// --- locale metadata -----------------------------------------------------
for (const locale of ['en', 'zh']) {
  const dict = JSON.parse(read(`locale/${locale}.json`))
  assert.ok(dict.meta, `${locale} has meta`)
  assert.ok(dict.meta.title && dict.meta.title.length > 0, `${locale} meta.title`)
  assert.ok(dict.meta.description && dict.meta.description.length > 10, `${locale} meta.description`)
}
const en = JSON.parse(read('locale/en.json'))
const zh = JSON.parse(read('locale/zh.json'))
// The product name is intentionally identical across locales; the description
// must actually be localized (the zh one carries CJK text).
assert.notEqual(en.meta.description, zh.meta.description, 'descriptions are localized')
assert.ok(/[\u4e00-\u9fff]/.test(zh.meta.description), 'zh description contains Chinese')
assert.ok(!/[\u4e00-\u9fff]/.test(en.meta.description), 'en description is English')
ok('locale metadata', 'en + zh, title shared, descriptions localized')

// --- icon ----------------------------------------------------------------
const icon = readFileSync(path.join(here, 'icon.svg'))
assert.ok(icon.length > 0 && icon.length < 256 * 1024, `icon size ${icon.length} bytes`)
assert.ok(icon.subarray(0, 200).toString('utf8').includes('<svg'), 'icon is SVG')
assert.ok(icon.toString('utf8').includes('xmlns="http://www.w3.org/2000/svg"'), 'icon declares the SVG namespace')
assert.ok(icon.toString('utf8').includes('viewBox'), 'icon has a viewBox')
ok('icon', `${icon.length} bytes, valid SVG header`)

// --- patch ---------------------------------------------------------------
const patch = read('cordis.patch.yml')
assert.ok(patch.includes('- insert:'), 'patch is an insert list')
assert.ok(patch.includes("id: idea-git"), 'patch inserts the idea-git row')
assert.ok(patch.includes("name: '@local/idea-git'"), 'patch names the bundle')
assert.ok(patch.includes('config:'), 'patch carries the config defaults')
assert.ok(patch.includes('stampAttribution:'), 'config declares stampAttribution')
assert.ok(patch.includes('agentCommitHint:'), 'config declares agentCommitHint')
assert.ok(patch.includes("attributionKey: 'Assisted-by'"), 'config declares attributionKey')
ok('bundle patch', 'insert row with three config fields')

// --- syntax (a real `node --check` child, stdio redirected to a file so it
// works where piped child stdio is blocked) --------------------------------
import { spawnSync } from 'node:child_process'
import { closeSync, openSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'

function syntaxCheck(file) {
  const out = path.join(tmpdir(), `idea-git-check-${process.pid}-${Math.random().toString(36).slice(2)}.txt`)
  const fd = openSync(out, 'w')
  try {
    const result = spawnSync(process.execPath, ['--check', path.join(here, file)], {
      stdio: ['ignore', fd, fd],
      windowsHide: true,
    })
    if (result.status !== 0) {
      throw new Error(`${file} failed node --check:\n${readFileSync(out, 'utf8')}`)
    }
  } finally {
    closeSync(fd)
    rmSync(out, { force: true })
  }
}

for (const file of ['index.js', 'git-core.js', 'client.js']) syntaxCheck(file)
ok('javascript syntax', 'index.js, git-core.js, client.js pass node --check')

console.log('\nrelease checklist passed')
