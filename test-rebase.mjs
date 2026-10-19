import assert from 'node:assert/strict'
import { cp, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createRunner, repoInfo, resolveRepo, runAction } from './git-core.js'

const workspace = path.resolve('..')
const source = path.join(workspace, 'idea-git-demo')
const target = path.join(workspace, '.tmp-rebase-test')
await rm(target, { recursive: true, force: true })
await cp(source, target, { recursive: true, force: true })
const git = createRunner({ cwd: workspace })
const root = await resolveRepo(git, target)
const initial = (await git.run(['rev-list', '--max-parents=0', 'HEAD'], { cwd: root })).stdout.trim()
await git.run(['reset', '--hard', 'HEAD'], { cwd: root })
await git.run(['checkout', '-b', 'rebase-test', initial], { cwd: root })
await writeFile(path.join(root, 'a.txt'), 'A\n')
await git.run(['add', 'a.txt'], { cwd: root })
await git.run(['commit', '-m', 'A'], { cwd: root })
const a = (await git.run(['rev-parse', 'HEAD'], { cwd: root })).stdout.trim()
await writeFile(path.join(root, 'b.txt'), 'B\n')
await git.run(['add', 'b.txt'], { cwd: root })
await git.run(['commit', '-m', 'B'], { cwd: root })
const b = (await git.run(['rev-parse', 'HEAD'], { cwd: root })).stdout.trim()
await writeFile(path.join(root, 'c.txt'), 'C\n')
await git.run(['add', 'c.txt'], { cwd: root })
await git.run(['commit', '-m', 'C'], { cwd: root })
const c = (await git.run(['rev-parse', 'HEAD'], { cwd: root })).stdout.trim()

const result = await runAction(git, root, 'rebaseApply', {
  base: initial,
  steps: [
    { hash: c, action: 'pick', subject: 'C' },
    { hash: b, action: 'squash', subject: 'B' },
    { hash: a, action: 'drop', subject: 'A' },
  ],
})
console.log('rebase output:', String(result.output).trim().split('\n').slice(-3).join(' | '))
const count = Number.parseInt((await git.run(['rev-list', '--count', `${initial}..HEAD`], { cwd: root })).stdout.trim(), 10)
assert.equal(count, 1)
const files = (await git.run(['ls-tree', '--name-only', 'HEAD'], { cwd: root })).stdout
assert.match(files, /b\.txt/)
assert.match(files, /c\.txt/)
assert.doesNotMatch(files, /a\.txt/)
const info = await repoInfo(git, root)
assert.equal(info.operation, null)
console.log('rebase smoke passed:', { commits: count, branch: info.branch })
await rm(target, { recursive: true, force: true })
