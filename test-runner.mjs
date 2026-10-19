/**
 * Test-only git runner: the DSH tool sandbox blocks piped stdio for child
 * processes, so this adapter redirects stdout/stderr to regular files (which
 * the sandbox permits) and exposes the same `run(args, options)` contract as
 * the production execFile runner in git-core.js.
 */
import { spawn } from 'node:child_process'
import { closeSync, mkdirSync, openSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { GitError } from './git-core.js'

const TMP = path.join(process.cwd(), '.tmp-runner')
mkdirSync(TMP, { recursive: true })
let counter = 0

export function createFileRunner(options = {}) {
  const commands = []
  const baseEnv = {
    GIT_PAGER: 'cat',
    GIT_TERMINAL_PROMPT: '0',
    GIT_OPTIONAL_LOCKS: '0',
    GIT_MERGE_AUTOEDIT: 'no',
    GIT_EDITOR: ':',
    GIT_SEQUENCE_EDITOR: ':',
    LANG: 'C',
    LC_ALL: 'C',
    ...options.env,
  }
  async function run(args, runOptions = {}) {
    const id = `${process.pid}-${counter++}`
    const outPath = path.join(TMP, `${id}.out`)
    const errPath = path.join(TMP, `${id}.err`)
    const outFd = openSync(outPath, 'w')
    const errFd = openSync(errPath, 'w')
    const started = Date.now()
    const timeout = runOptions.timeout ?? 25_000
    let timer
    let child
    const code = await new Promise((resolve, reject) => {
      child = spawn('git', args, {
        cwd: runOptions.cwd ?? options.cwd,
        env: { ...process.env, ...baseEnv, ...runOptions.env },
        stdio: ['ignore', outFd, errFd],
        windowsHide: true,
      })
      child.on('error', (error) => {
        clearTimeout(timer)
        reject(error)
      })
      timer = setTimeout(() => {
        child.kill('SIGKILL')
      }, timeout)
      child.on('exit', (exitCode, signal) => {
        clearTimeout(timer)
        resolve(exitCode ?? (signal ? 1 : 0))
      })
    }).catch((error) => {
      closeSync(outFd)
      closeSync(errFd)
      throw new GitError('git-not-found', error.message)
    })
    closeSync(outFd)
    closeSync(errFd)
    const stdout = readFileSync(outPath, 'utf8')
    const stderr = readFileSync(errPath, 'utf8')
    commands.push({ cmd: `git ${args.join(' ')}`, ms: Date.now() - started, code })
    if (code !== 0 && !(runOptions.allowCodes ?? []).includes(code)) {
      throw new GitError('git-failed', (stderr || stdout || 'git failed').trim(), { command: args.join(' '), exitCode: code, stderr })
    }
    return { stdout, stderr, code }
  }
  return { run, commands }
}
