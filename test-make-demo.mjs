/**
 * Create the demo repository the checks run against.
 *
 * The fixture is generated rather than committed so the bundle stays a single
 * self-contained repository: a nested `.git` inside this one would become a
 * gitlink instead of a usable fixture.
 *
 *   node test-make-demo.mjs [target]
 *
 * Produces: an initial commit, a feature branch, a merge, an annotated tag, a
 * release branch, one stash entry, and a dirty working tree (staged,
 * unstaged and untracked files).
 */
import assert from 'node:assert/strict'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createRunner, resolveRepo } from './git-core.js'

const target = path.resolve(process.argv[2] || path.join(process.cwd(), '..', 'idea-git-demo'))
const workspace = path.dirname(target)
await rm(target, { recursive: true, force: true })
await mkdir(target, { recursive: true })

const git = createRunner({ cwd: workspace })
const run = (args) => git.run(args, { cwd: target })
const write = (file, text) => writeFile(path.join(target, file), text, 'utf8')
const commit = (message) => run(['commit', '-m', message])

await run(['init', '-q', '--initial-branch=main'])
await run(['config', 'user.name', 'Ada Lovelace'])
await run(['config', 'user.email', 'ada@example.com'])
await run(['config', 'core.autocrlf', 'false'])

write('README.md', '# Demo\n\nInitial line.\n')
await run(['add', '-A'])
await commit('chore: initial commit')
const initial = (await run(['rev-parse', 'HEAD'])).stdout.trim()

await run(['branch', 'feature/graph'])

write('app.js', "export const app = 'main';\n")
await run(['add', '-A'])
await commit('feat: add application entry')

await run(['checkout', '-q', 'feature/graph'])
await mkdir(path.join(target, 'src'), { recursive: true })
write('src/graph.js', "export function layout() { return 'lanes'; }\n")
await run(['add', '-A'])
await commit('feat(graph): lay out commit lanes')
write('src/graph.js', "export function layout() { return 'lanes'; }\nexport const colors = ['blue', 'green'];\n")
await run(['add', '-A'])
await commit('feat(graph): color branch lanes')

await run(['checkout', '-q', 'main'])
write('README.md', '# Demo\n\nInitial line.\n\nMain branch documentation.\n')
await run(['add', '-A'])
await commit('docs: describe the main branch')
await run(['merge', '--no-ff', 'feature/graph', '-m', 'merge: feature/graph into main'])
await run(['tag', '-a', 'v1.0.0', '-m', 'Release 1.0.0'])
await run(['branch', 'release/1.x'])

// One stash entry, then a dirty working tree.
write('README.md', '# Demo\n\nInitial line.\n\nMain branch documentation.\n\nStashed work.\n')
await run(['stash', 'push', '-u', '-m', 'wip: readme polish'])
write('README.md', '# Demo\n\nInitial line.\n\nMain branch documentation.\n\nWorking tree edit.\n')
write('staged.txt', 'staged file\n')
await run(['add', 'staged.txt'])
write('untracked.txt', 'untracked\ncontent\n')

const root = await resolveRepo(git, target)
const head = (await run(['rev-parse', '--short', 'HEAD'])).stdout.trim()
const branches = (await run(['for-each-ref', '--format=%(refname:short)', 'refs/heads'])).stdout.split('\n').filter(Boolean)
const stashes = (await run(['stash', 'list'])).stdout.split('\n').filter(Boolean)
assert.ok(branches.includes('main') && branches.includes('feature/graph') && branches.includes('release/1.x'))
assert.equal(stashes.length, 1)

console.log(`demo repository ready at ${root}`)
console.log(`  HEAD ${head}, branches: ${branches.join(', ')}`)
console.log(`  stash entries: ${stashes.length}, working tree: staged + unstaged + untracked`)
console.log(`  initial commit: ${initial.slice(0, 8)} (rebasing it is not supported, by design)`)
