# IDEA Git

An IntelliJ IDEA-style Git workbench for the DeepSeek Harness Web UI. It adds a **Git** icon to the sidebar and opens a full central panel rather than a small widget.

> After installing or updating the bundle, refresh the Harness page once so the browser loads the latest Client half. The Host half activates immediately.

## What it brings from IDEA

- **Readable commit graph** — colored lanes, merge curves, ref labels, HEAD emphasis and virtualized rows.
- **Log** — branch/remote/tag tree, multi-ref filtering, search, author/path/date filters, first-parent mode and incremental loading.
- **Commit details** — subject and body, author/committer, parents, refs, first-parent changed files with a collapsible directory tree and per-file diff.
- **Diff viewer** — side-by-side and unified modes, intra-line word highlighting, ignore-whitespace, file navigation, binary/large-file handling, and **selective hunk staging** straight from the working-tree and index diffs, with a fine-grained (zero-context) mode that splits nearby changes into separately stageable hunks.
- **Local Changes** — staged/unstaged/conflicted/untracked groups, per-file and per-hunk staging, discard with confirmation, commit/amend/sign-off, and commit & push.
- **File history** — rename-following history for any tracked file, with a searchable file tree.
- **Annotate (blame)** — per-line authors with colors, revision input, "annotate previous revision", and commit details beside the source.
- **Stash** — create, inspect, apply, pop and drop stashes.
- **Branches and refs** — checkout (tracking remotes), create from any commit or ref, merge, rebase onto, delete, cherry-pick, revert and reset.
- **Compare** — "compare with current" between any ref and HEAD, with a changed-file list and per-file range diff.
- **Tags** — create lightweight or annotated tags from any commit.
- **Interactive rebase** — a planner over the linear range above the newest merge: reorder, pick, squash, fixup and drop, executed through a generated `rebase -i` todo.
- **Conflicts** — an operation banner with continue/abort, plus per-file accept-ours/accept-theirs resolution.
- **Remote workflow** — fetch, pull, rebase-pull, push dialog with upstream selection, and ahead/behind counts.
- **Console** — every host command with duration and exit code.
- **AI attribution** — commit trailers (`Assisted-by`, `Co-authored-by`, `Generated-by`, `Signed-off-by`, …) render as chips in commit details, so a commit that names its model is traceable at a glance; blame a line, open its commit, and the trailer is right there.
- **Location quick-copy** — click a diff line (shift-click to extend) or a blame row and copy `path:12-30 @ 1f073153`; file and commit menus carry the same reference. Paste it straight at the AI to point at one region.
- **Persisted layout** — selected tab, split width, diff mode, diff context, filters and the local draft commit message survive reloads.

## AI attribution: how it works

Git has no concept of "which AI wrote this", so the plugin records it the git-native way — trailers — and displays whatever the repository already carries.

- **Display (always on)** — every trailer is parsed from the commit and rendered as a chip. Any repo, any tool, any key works, and existing history is visible immediately.
- **Agent commits** — a registered system-prompt section asks the agent to append `Assisted-by: dsh/<its model>` when it creates a commit. This is the common case, because agent commits go through the bash tool rather than this panel.
- **Panel commits** — the panel stamps `Assisted-by: dsh/<provider>/<model> (session <id>)` from the live agents that work in this repository, which carries the model the session actually runs plus its session id. A trailer you wrote yourself is never duplicated, and `--amend --no-edit` is left untouched. When no agent matches the repository it falls back to the documented `agentDefaultModel` service and labels the value `default-selection` rather than pretending to be a per-agent fact.

Both stamping paths are configurable (see below); display cannot be disabled because it only reads what is already in the repository.

The agent field names (`id`, `options.model`, `options.provider`, `session.header.cwd`) were confirmed against a live `Agent` object in this Harness (0.2.1-rc.2) with a temporary read-only probe, and every read is guarded so a different shape degrades to the fallback instead of throwing.

## Configuration

The bundle row accepts three fields (see `cordis.patch.yml`); all default to the values shown.

| Field | Default | Meaning |
|---|---|---|
| `stampAttribution` | `true` | Append the `Assisted-by` trailer to commits this panel creates. |
| `agentCommitHint` | `true` | Register the prompt section that asks agents to stamp their own commits. |
| `attributionKey` | `Assisted-by` | Trailer key used when stamping. |

## Known limits

IDEA features that need an editor surface (gutter blame, jump-to-source), rebase `reword` with inline message editing, drag-and-drop rebase ordering, changelists and Local History are intentionally out of scope for this panel.

Two attribution caveats worth knowing: when no live agent is working in the repository the stamp falls back to the *default* model selection (and says so in the value), and a commit made by the agent in a terminal is only traceable if that agent honoured the prompt-section request.

## Safety

- Git is always invoked with an argv array, never through a shell.
- Refs, hashes, branch names and paths are validated before use; path arguments follow `--`.
- Interactive prompts, pagers and editors are disabled (`GIT_TERMINAL_PROMPT=0`, `GIT_PAGER=cat`, `GIT_EDITOR=:`).
- Destructive actions (discard, hard reset, delete branch, drop stash, checkout revision) ask for confirmation.
- The plugin exposes one authenticated Host route; browser requests use the Harness connection trust fence.

## Layout

| File | Role |
|---|---|
| `index.js` | Host plugin: authenticated web route, workspace discovery, RPC dispatch |
| `git-core.js` | Git execution, validation and parsers (plain Node ESM, unit-tested) |
| `client.js` | Browser half: slot registration, locale, graph, diff and all views |
| `cordis.patch.yml` | Bundle patch that inserts the Host row |
| `locale/*.json` | Plugin Manager title and description |

## Keyboard

- `F5` refresh
- `Ctrl/Cmd+Enter` commit from the message box
- `Up/Down` move through the log; `Enter` opens the first changed file
- `Esc` closes a diff, menu, popover or dialog

## Development checks

The runtime has no dependencies beyond the Harness; every check below uses only Node.js and Git. Three of them run against a demo repository, which is **generated rather than committed** (a nested `.git` inside this one would become a gitlink instead of a usable fixture):

```powershell
node test-make-demo.mjs ..\idea-git-demo   # create the fixture: branches, merge, tag, stash, dirty tree
```

```powershell
node test-release.mjs                     # release checklist: manifest, files, locale, icon, patch, syntax
node test-client-load.mjs                  # bundle syntax + slot/locale registration
node test-host-route.mjs                   # authenticated route, workspace scan, RPC + real git
node test-smoke.mjs ../idea-git-demo       # git engine read/write/rename/binary/stash/conflict/hunk/trailer checks
node test-rebase.mjs                       # interactive rebase plan (pick/squash/drop)

# Optional UI checks (need the dev-only React test renderer):
#   npm install --no-save --prefix .tmp-test react@18.3.1 react-test-renderer@18.3.1
node test-render-hunks.mjs                 # selective hunk staging in the diff viewer
node test-render-all.mjs                   # every tab, diff overlay, compare and rebase dialogs
node test-render-location.mjs              # diff line selection, blame copy, clipboard text
```

The Git engine also has a test adapter (`test-runner.mjs`) that redirects child output to files for sandboxed environments where piped stdio is blocked. The checks that mutate a repository always work on a copy, so the fixture survives a run.
