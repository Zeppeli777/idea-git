window.__ModuleLoader__.load({
  id: '@local/idea-git',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const NS = 'idea-git'
    const API = '/idea-git/rpc'
    const UI_KEY = 'idea-git.ui.v1'
    const ROW_H = 30
    const LANE_W = 14
    const GRAPH_PAD = 10

    /* ------------------------------------------------------------------ *
     * Locale
     * English keys double as dictionary keys; the Chinese dictionary maps
     * them. Missing keys fall back to the English key text.
     * ------------------------------------------------------------------ */
    const ZH = {
      'Git': 'Git',
      'Git workbench': 'Git 工作台',
      'commits': '提交',
      'changed': '变更',
      'changes': '项更改',
      'staged': '已暂存',
      'unstaged': '未暂存',
      'gone': '已删除',
      'Commit details': '提交详情',
      'No remote configured': '未配置远程仓库',
      'Copy name': '复制名称',
      'Copy subject': '复制主题',
      'Show command output': '显示命令输出',
      'Merging': '合并中',
      'Rebasing': '变基中',
      'Cherry-picking': '拣选中',
      'Reverting': '还原中',
      'Bisecting': '二分查找中',
      'No repository': '未打开仓库',
      'Open a repository': '打开仓库',
      'Initialize Git in a workspace or open an existing repository.': '请在工作区初始化 Git，或打开一个已有仓库。',
      'Compare with current': '与当前分支比较',
      'Compare': '比较',
      'No changes between these refs': '这两个引用之间没有差异',
      'New tag…': '新建标签…',
      'New tag from here…': '从此处新建标签…',
      'Create tag': '创建标签',
      'Tag name': '标签名称',
      'Tag message': '标签说明',
      'Annotated tag': '附注标签',
      'Annotated tags store a message and creator metadata.': '附注标签会保存说明与创建者信息。',
      'Tag created': '标签已创建',
      'Compare branches': '比较分支',
      'Interactive rebase…': '交互式变基…',
      'Interactive rebase': '交互式变基',
      'Rewrites the selected commits. This cannot be undone.': '将重写选中的提交，此操作无法撤销。',
      'Pick': '保留',
      'Squash': '压缩',
      'Fixup': '修正',
      'Drop': '删除',
      'Apply rebase': '执行变基',
      'Move up': '上移',
      'Move down': '下移',
      'No commits to rebase': '没有可变基的提交',
      'The first kept commit must be a pick.': '第一个保留的提交必须是“保留”。',
      'The plan drops every commit.': '计划删除了所有提交。',
      'History contains merge commits; only the linear range above the newest merge is available.': '历史中包含合并提交；仅显示最新合并之上的线性范围。',
      'Ours': '我方',
      'Theirs': '对方',
      'Accept ours': '接受我方',
      'Accept theirs': '接受对方',
      'Resolve conflict': '解决冲突',
      'Stage selected hunks': '暂存所选代码块',
      'Unstage selected hunks': '取消暂存所选代码块',
      'Select hunk': '选择代码块',
      'Hunks staged': '代码块已暂存',
      'Hunks unstaged': '代码块已取消暂存',
      'Annotate previous revision': '注解上一版本',
      'Previous revision': '上一版本',
      'Fine-grained hunks': '细粒度代码块',
      'Trailers': 'Trailer 归属',
      'Assisted-by': 'Assisted-by',
      'Co-authored-by': 'Co-authored-by',
      'Generated-by': 'Generated-by',
      'Signed-off-by': 'Signed-off-by',
      'This panel stamps commits with an Assisted-by trailer.': '本面板的提交会自动带上 Assisted-by trailer。',
      'Copy location': '复制位置',
      'Location copied': '位置已复制',
      'Selected lines': '选中行',
      'Repository': '仓库',
      'Repositories': '仓库',
      'Open repository': '打开仓库',
      'Repository path': '仓库路径',
      'Scan again': '重新扫描',
      'No Git repository found': '未找到 Git 仓库',
      'This workspace is not a Git repository. Open a repository path or scan again after initializing one.':
        '当前工作区不是 Git 仓库。可以打开一个仓库路径，或在初始化后重新扫描。',
      'Log': '日志',
      'Local Changes': '本地更改',
      'File History': '文件历史',
      'Blame': '注解',
      'Stash': '暂存架',
      'Console': '控制台',
      'Refresh': '刷新',
      'Fetch': '获取',
      'Pull': '拉取',
      'Push': '推送',
      'Pull with rebase': '变基拉取',
      'More': '更多',
      'Abort operation': '中止操作',
      'Continue': '继续',
      'Abort': '中止',
      'Copy repository path': '复制仓库路径',
      'Rescan repositories': '重新扫描仓库',
      'All branches': '全部分支',
      'Local': '本地',
      'Remote': '远程',
      'Tags': '标签',
      'branches': '个分支',
      'tags': '个标签',
      'Search branches': '搜索分支',
      'Search commits': '搜索提交',
      'Search': '搜索',
      'Filters': '筛选',
      'Author': '作者',
      'Path': '路径',
      'Since': '起始',
      'Until': '截止',
      'First parent only': '仅第一父提交',
      'Clear filters': '清除筛选',
      'Load more': '加载更多',
      'Loading…': '加载中…',
      'No commits': '没有提交',
      'No commits match these filters': '没有符合筛选条件的提交',
      'Commit': '提交',
      'Subject': '主题',
      'Date': '日期',
      'Hash': '哈希',
      'Details': '详情',
      'Files': '文件',
      'files': '个文件',
      'Changed files': '变更文件',
      'No file changes': '没有文件变更',
      'first-parent diff': '第一父提交差异',
      'Open diff': '打开差异',
      'Copy hash': '复制哈希',
      'Copy path': '复制路径',
      'Checkout revision': '检出此版本',
      'Create branch here…': '从此处创建分支…',
      'Cherry-pick': '拣选',
      'Revert': '还原',
      'Reset…': '重置…',
      'Merge into current': '合并到当前分支',
      'Rebase current onto': '将当前分支变基到',
      'New branch from here…': '从此处新建分支…',
      'Delete branch': '删除分支',
      'Blame this file': '注解此文件',
      'History for this file': '此文件的历史',
      'Open on remote': '在远程打开',
      'parent': '父提交',
      'parents': '父提交',
      'committed': '提交于',
      'authored': '作者时间',
      'Committer': '提交者',
      'Message': '消息',
      'Commit message': '提交消息',
      'Describe your changes': '描述你的更改',
      'Commit to': '提交到',
      'Stage all': '全部暂存',
      'Unstage all': '全部取消暂存',
      'Stage': '暂存',
      'Unstage': '取消暂存',
      'Discard…': '丢弃…',
      'Discard changes': '丢弃更改',
      'This cannot be undone.': '此操作无法撤销。',
      'Staged': '已暂存',
      'Unstaged': '未暂存',
      'Untracked': '未跟踪',
      'Conflicts': '冲突',
      'No local changes': '没有本地更改',
      'Working tree clean': '工作区干净',
      'Amend': '修补',
      'Sign-off': '署名',
      'Commit & Push': '提交并推送',
      'Leave the message empty to keep the previous one when amending.': '修补提交时留空消息可保留上一条消息。',
      'Stage files before committing.': '提交前请先暂存文件。',
      'Set your Git identity before committing.': '提交前请设置 Git 身份。',
      'Committed': '已提交',
      'Changes discarded': '更改已丢弃',
      'Stashed': '已暂存到暂存架',
      'Stash changes': '暂存更改',
      'Stash message': '暂存说明',
      'Optional message': '可选说明',
      'Include untracked files': '包含未跟踪文件',
      'Apply': '应用',
      'Pop': '弹出',
      'Drop': '删除',
      'No stashes': '暂存架为空',
      'Stash is empty': '暂存架为空',
      'View diff': '查看差异',
      'Apply stash': '应用暂存',
      'Pop stash': '弹出暂存',
      'Drop stash': '删除暂存',
      'File history': '文件历史',
      'Select a file to see its history': '选择一个文件查看历史',
      'Follow renames': '跟随重命名',
      'No history for this file': '此文件没有历史',
      'Annotate': '注解',
      'Revision': '版本',
      'Working tree': '工作区',
      'Select a file to annotate': '选择一个文件进行注解',
      'No blame data': '没有注解数据',
      'Unknown author': '未知作者',
      'Console is empty': '控制台为空',
      'Commands run by this panel appear here.': '此面板执行的 Git 命令会显示在这里。',
      'Clear': '清空',
      'Duration': '耗时',
      'Exit code': '退出码',
      'Command': '命令',
      'Error': '错误',
      'Close': '关闭',
      'Cancel': '取消',
      'OK': '确定',
      'Create': '创建',
      'Create branch': '创建分支',
      'Branch name': '分支名称',
      'Start point': '起点',
      'Checkout after create': '创建后检出',
      'Reset': '重置',
      'Soft': '软重置',
      'Mixed': '混合重置',
      'Hard': '硬重置',
      'Reset mode': '重置模式',
      'Reset branch to': '将分支重置到',
      'Hard reset discards all working tree changes.': '硬重置会丢弃所有工作区更改。',
      'Push branch': '推送分支',
      'Remote': '远程',
      'Branch': '分支',
      'Set upstream': '设置上游',
      'Stash all local changes': '暂存所有本地更改',
      'Diff': '差异',
      'Split': '并排',
      'Unified': '统一',
      'Ignore whitespace': '忽略空白',
      'Previous file': '上一个文件',
      'Next file': '下一个文件',
      'Binary file': '二进制文件',
      'Binary file differs': '二进制文件存在差异',
      'No textual changes': '没有文本差异',
      'File is too large to display': '文件过大，无法显示',
      'Diff truncated': '差异已截断',
      'Working tree': '工作区',
      'Index': '暂存区',
      'Commit': '提交',
      'Stash entry': '暂存项',
      'Open file history': '打开文件历史',
      'Open blame': '打开注解',
      'source': '源码',
      'line': '行',
      'lines': '行',
      'Loading repository…': '正在加载仓库…',
      'Git was not found': '未找到 Git',
      'Install Git and restart the Harness.': '请安装 Git 并重启 Harness。',
      'Authentication failed': '认证失败',
      'The Git panel could not reach the Host.': 'Git 面板无法连接 Host。',
      'Try again': '重试',
      'Operation in progress': '操作进行中',
      'Resolve conflicts, stage the files, then continue.': '解决冲突、暂存文件，然后继续。',
      'Detached HEAD': '分离头指针',
      'Ahead': '领先',
      'Behind': '落后',
      'Clean': '干净',
      'Working tree has changes': '工作区有更改',
      'Updated': '已更新',
      'just now': '刚刚',
      'new branch': '新分支',
      'Checkout': '检出',
      'Merge': '合并',
      'Rebase': '变基',
      'Apply and drop': '应用并删除',
      'Uncommitted changes': '未提交的更改',
      'Stage the changes first.': '请先暂存更改。',
      'Nothing to stash': '没有可暂存的内容',
      'Confirm': '确认',
      'Danger': '危险',
      'This action cannot be undone.': '此操作无法撤销。',
      'Go to file': '转到文件',
      'Filter files': '筛选文件',
      'No files': '没有文件',
      'Tracked': '已跟踪',
      'All files': '全部文件',
      'Staged changes': '暂存的更改',
      'Unstaged changes': '未暂存的更改',
      'Conflict': '冲突',
      'Modified': '已修改',
      'Added': '新增',
      'Deleted': '删除',
      'Renamed': '重命名',
      'Copied': '复制',
      'Type changed': '类型变更',
      'Unmerged': '未合并',
      'status': '状态',
      'files changed': '个文件变更',
      'insertions': '行新增',
      'deletions': '行删除',
      'Show all': '显示全部',
      'Show less': '收起',
      'Open': '打开',
      'Scanning…': '扫描中…',
      'No workspaces are registered yet.': '尚未注册工作区。',
      'Branches': '分支',
      'Current': '当前',
      'HEAD': 'HEAD',
      'tag': '标签',
      'remote': '远程',
      'local': '本地',
      'Copy': '复制',
      'Copied': '已复制',
      'Refresh log': '刷新日志',
      'Show details': '显示详情',
      'Hide details': '隐藏详情',
      'Show command output': '显示命令输出',
      'Hide command output': '隐藏命令输出',
      'Open in console': '在控制台打开',
      'file': '文件',
      'stash': '暂存',
      'back': '返回',
      'Branches and tags': '分支与标签',
      'No matching branches': '没有匹配的分支',
      'No matching files': '没有匹配的文件',
      'No matching commits': '没有匹配的提交',
      'Unknown error': '未知错误',
      'Git error': 'Git 错误',
      'Repository is empty': '仓库为空',
      'Create the first commit to see a graph.': '创建第一个提交后即可看到图形。',
      'Local changes are shown here.': '本地更改会显示在这里。',
      'Select a commit to see details.': '选择一个提交查看详情。',
      'Select a file to see the diff.': '选择一个文件查看差异。',
      'All changes': '全部更改',
      'Only this file': '仅此文件',
      'Compare with current': '与当前比较',
      'Open current file history': '打开当前文件历史',
      'No diff available': '没有可用的差异',
      'Filter': '筛选',
      'Clear search': '清除搜索',
      'Loading…': '加载中…',
      'Staged files': '已暂存文件',
      'Unstaged files': '未暂存文件',
      'Untracked files': '未跟踪文件',
      'Conflicted files': '冲突文件',
      'Commit message is empty': '提交消息为空',
      'Are you sure?': '确定吗？',
      'Delete': '删除',
    }
    const EN = Object.fromEntries(Object.keys(ZH).map((key) => [key, key]))
    let localeService = null
    let boundTranslate = null

    function fallbackTranslate(key) {
      return key
    }

    function useT() {
      return React.useContext(LocaleContext) || fallbackTranslate
    }

    function useLocaleRevision() {
      const [, force] = React.useState(0)
      React.useEffect(() => {
        if (!localeService) return undefined
        return localeService.subscribe(() => force((value) => value + 1))
      }, [])
    }

    const LocaleContext = React.createContext(fallbackTranslate)

    /* ------------------------------------------------------------------ *
     * Small utilities
     * ------------------------------------------------------------------ */
    const cx = (...values) => values.filter(Boolean).join(' ')
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

    function parseJson(value, fallback) {
      if (!value) return fallback
      try {
        const parsed = JSON.parse(value)
        return parsed && typeof parsed === 'object' ? parsed : fallback
      } catch {
        return fallback
      }
    }

    function loadUiState() {
      try {
        return parseJson(window.localStorage.getItem(UI_KEY), {})
      } catch {
        return {}
      }
    }

    function saveUiState(value) {
      try {
        window.localStorage.setItem(UI_KEY, JSON.stringify(value))
      } catch {
        /* storage may be unavailable */
      }
    }

    function shortHash(hash, length = 8) {
      return String(hash || '').slice(0, length)
    }

    function shortPath(value) {
      const text = String(value || '')
      if (text.length <= 64) return text
      return `…${text.slice(-61)}`
    }

    function basename(value) {
      const text = String(value || '')
      const index = Math.max(text.lastIndexOf('/'), text.lastIndexOf('\\'))
      return index >= 0 ? text.slice(index + 1) : text
    }

    function dirname(value) {
      const text = String(value || '')
      const index = Math.max(text.lastIndexOf('/'), text.lastIndexOf('\\'))
      return index > 0 ? text.slice(0, index) : ''
    }

    function formatNumber(value) {
      const number = Number(value) || 0
      try {
        return new Intl.NumberFormat(undefined).format(number)
      } catch {
        return String(number)
      }
    }

    function formatDuration(ms) {
      const value = Number(ms) || 0
      if (value < 1000) return `${value} ms`
      if (value < 60_000) return `${(value / 1000).toFixed(value < 10_000 ? 1 : 0)} s`
      return `${Math.floor(value / 60_000)}m ${Math.round((value % 60_000) / 1000)}s`
    }

    function formatAbsolute(seconds) {
      if (!seconds) return ''
      const date = new Date(Number(seconds) * 1000)
      if (Number.isNaN(date.getTime())) return ''
      try {
        return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(date)
      } catch {
        return date.toISOString()
      }
    }

    function formatDay(seconds) {
      if (!seconds) return ''
      const date = new Date(Number(seconds) * 1000)
      if (Number.isNaN(date.getTime())) return ''
      try {
        return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
      } catch {
        return date.toISOString().slice(0, 10)
      }
    }

    function relativeTime(seconds, t) {
      if (!seconds) return ''
      const delta = Math.round((Date.now() - Number(seconds) * 1000) / 1000)
      if (delta < 45) return t('just now')
      const units = [
        ['year', 31_536_000],
        ['month', 2_592_000],
        ['week', 604_800],
        ['day', 86_400],
        ['hour', 3_600],
        ['minute', 60],
      ]
      for (const [unit, size] of units) {
        if (Math.abs(delta) >= size) {
          const value = Math.round(delta / size)
          try {
            return new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' }).format(-value, unit)
          } catch {
            return `${value} ${unit}${Math.abs(value) === 1 ? '' : 's'} ago`
          }
        }
      }
      return t('just now')
    }

    function hashColor(value) {
      const palette = ['#5b8def', '#c678dd', '#56b6c2', '#e5a04c', '#98c379', '#e06c75', '#7f9cf5', '#d19a66']
      let hash = 0
      const text = String(value || '')
      for (let index = 0; index < text.length; index += 1) {
        hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0
      }
      return palette[Math.abs(hash) % palette.length]
    }

    function initials(name) {
      const text = String(name || '').trim()
      if (!text) return '?'
      const parts = text.split(/[\s._-]+/).filter(Boolean)
      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }

    function statusMeta(status) {
      const code = String(status || '?').toUpperCase()
      const table = {
        A: { label: 'Added', tone: 'ok' },
        M: { label: 'Modified', tone: 'warn' },
        D: { label: 'Deleted', tone: 'err' },
        R: { label: 'Renamed', tone: 'info' },
        C: { label: 'Copied', tone: 'info' },
        T: { label: 'Type changed', tone: 'warn' },
        U: { label: 'Unmerged', tone: 'err' },
        '?': { label: 'Untracked', tone: 'info' },
      }
      return table[code] || { label: code, tone: 'info' }
    }

    function parseDecorations(raw, refs) {
      const text = String(raw || '')
      if (!text) return []
      const localNames = new Set((refs?.local || []).map((entry) => entry.name))
      const remoteNames = new Set((refs?.remote || []).map((entry) => entry.name))
      const tagNames = new Set((refs?.tags || []).map((entry) => entry.name))
      const result = []
      for (const part of text.split(', ')) {
        const value = part.trim()
        if (!value) continue
        if (value.startsWith('HEAD -> ')) {
          const name = value.slice(8)
          result.push({ kind: 'head', name: 'HEAD' })
          if (!result.some((entry) => entry.kind === 'local' && entry.name === name)) {
            result.push({ kind: 'local', name })
          }
          continue
        }
        if (value === 'HEAD') {
          result.push({ kind: 'head', name: 'HEAD' })
          continue
        }
        if (value.startsWith('tag: ')) {
          const name = value.slice(5)
          result.push({ kind: 'tag', name })
          continue
        }
        if (localNames.has(value)) {
          result.push({ kind: 'local', name: value })
        } else if (remoteNames.has(value)) {
          result.push({ kind: 'remote', name: value })
        } else if (tagNames.has(value)) {
          result.push({ kind: 'tag', name: value })
        } else if (value.includes('/') && !value.endsWith('/HEAD')) {
          result.push({ kind: 'remote', name: value })
        } else {
          result.push({ kind: 'local', name: value })
        }
      }
      const seen = new Set()
      return result.filter((entry) => {
        const key = `${entry.kind}:${entry.name}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
    }

    function remoteWebUrl(remoteUrl, hash, file) {
      const value = String(remoteUrl || '').replace(/\.git$/, '')
      if (!value) return ''
      let base = ''
      let match = value.match(/^git@([^:]+):(.+)$/)
      if (match) base = `https://${match[1]}/${match[2]}`
      match = value.match(/^ssh:\/\/git@([^/]+)\/(.+)$/)
      if (!base && match) base = `https://${match[1]}/${match[2]}`
      if (!base) base = value.replace(/\/$/, '')
      if (!/^https?:\/\//.test(base)) return ''
      const host = base.replace(/^https?:\/\//, '').split('/')[0]
      if (host.includes('github')) {
        return file ? `${base}/blob/${hash}/${file}` : `${base}/commit/${hash}`
      }
      if (host.includes('gitlab')) {
        return file ? `${base}/-/blob/${hash}/${file}` : `${base}/-/commit/${hash}`
      }
      if (host.includes('bitbucket')) {
        return file ? `${base}/src/${hash}/${file}` : `${base}/commits/${hash}`
      }
      return `${base}/commit/${hash}`
    }

    /* ------------------------------------------------------------------ *
     * Icons: 16px stroke icons, original drawings.
     * ------------------------------------------------------------------ */
    const ICONS = {
      git: [
        ['circle', { cx: 4.5, cy: 3.5, r: 1.6 }],
        ['circle', { cx: 4.5, cy: 12.5, r: 1.6 }],
        ['circle', { cx: 11.5, cy: 6.5, r: 1.6 }],
        ['path', { d: 'M4.5 5.1v5.8' }],
        ['path', { d: 'M6.1 12.5h1.2c2.3 0 4.2-1.9 4.2-4.2v-.2' }],
      ],
      branch: [
        ['circle', { cx: 4.5, cy: 3.5, r: 1.6 }],
        ['circle', { cx: 4.5, cy: 12.5, r: 1.6 }],
        ['circle', { cx: 11.5, cy: 5.5, r: 1.6 }],
        ['path', { d: 'M4.5 5.1v5.8M6.1 12.5h1.4c2.2 0 4-1.8 4-4V7.1' }],
      ],
      tag: [
        ['path', { d: 'M2.5 3.5v4.2c0 .4.2.8.5 1.1l4.2 4.2c.6.6 1.5.6 2.1 0l3-3c.6-.6.6-1.5 0-2.1L8.1 3.7c-.3-.3-.7-.5-1.1-.5H3.2c-.4 0-.7.3-.7.7Z' }],
        ['circle', { cx: 5.4, cy: 5.4, r: 0.9 }],
      ],
      commit: [
        ['circle', { cx: 8, cy: 8, r: 2.6 }],
        ['path', { d: 'M1.5 8h3.9M10.6 8h3.9' }],
      ],
      refresh: [
        ['path', { d: 'M13.2 7.2a5.2 5.2 0 1 1-1.4-3.4' }],
        ['path', { d: 'M13.4 2.4v2.8h-2.8' }],
      ],
      fetch: [
        ['path', { d: 'M8 2.2v7.4' }],
        ['path', { d: 'm5 7 3 3 3-3' }],
        ['path', { d: 'M3 13.2h10' }],
      ],
      pull: [
        ['path', { d: 'M8 2.2v7.2' }],
        ['path', { d: 'm5.2 6.8 2.8 2.8 2.8-2.8' }],
        ['path', { d: 'M3.2 12.2v1.2h9.6v-1.2' }],
      ],
      push: [
        ['path', { d: 'M8 13.2V5.8' }],
        ['path', { d: 'm5.2 8.4 2.8-2.8 2.8 2.8' }],
        ['path', { d: 'M3.2 3.2v-1.2h9.6v1.2' }],
      ],
      search: [
        ['circle', { cx: 7, cy: 7, r: 4.2 }],
        ['path', { d: 'm10.2 10.2 3.3 3.3' }],
      ],
      close: [['path', { d: 'm3.5 3.5 9 9M12.5 3.5l-9 9' }]],
      check: [['path', { d: 'm3.2 8.3 3.2 3.2 6.4-7' }]],
      plus: [['path', { d: 'M8 3v10M3 8h10' }]],
      minus: [['path', { d: 'M3 8h10' }]],
      chevronDown: [['path', { d: 'm4 6 4 4 4-4' }]],
      chevronRight: [['path', { d: 'm6 4 4 4-4 4' }]],
      chevronLeft: [['path', { d: 'm10 4-4 4 4 4' }]],
      more: [
        ['circle', { cx: 3.5, cy: 8, r: 1 }],
        ['circle', { cx: 8, cy: 8, r: 1 }],
        ['circle', { cx: 12.5, cy: 8, r: 1 }],
      ],
      file: [
        ['path', { d: 'M4 1.8h5l3 3v9.4H4Z' }],
        ['path', { d: 'M9 1.8v3.2h3' }],
      ],
      folder: [['path', { d: 'M1.8 4.2h4l1.3 1.5h7.1v7.9H1.8Z' }]],
      clock: [
        ['circle', { cx: 8, cy: 8, r: 5.6 }],
        ['path', { d: 'M8 4.6V8l2.4 1.5' }],
      ],
      stash: [
        ['path', { d: 'M2 5.2h12v8.2H2Z' }],
        ['path', { d: 'M2 5.2 4 2h8l2 3.2M5.5 8.2h5v2.4h-5Z' }],
      ],
      terminal: [
        ['path', { d: 'M2 3.2h12v9.6H2Z' }],
        ['path', { d: 'm4.2 6 2.2 2-2.2 2M8 10.2h3.6' }],
      ],
      diff: [
        ['path', { d: 'M4 1.8h8v12.4H4Z' }],
        ['path', { d: 'M8 1.8v12.4M5.5 5h1M5.5 8h1M9.5 8h1M9.5 11h1' }],
      ],
      split: [
        ['path', { d: 'M2 2h5v12H2ZM9 2h5v12H9Z' }],
        ['path', { d: 'M7 6v4M9 6v4' }],
      ],
      unified: [
        ['path', { d: 'M2 2h12v12H2Z' }],
        ['path', { d: 'M2 6h12M2 10h12' }],
      ],
      copy: [
        ['path', { d: 'M5 4.5V2.2h8.8v8.8H11' }],
        ['path', { d: 'M2.2 5.2H11v8.6H2.2Z' }],
      ],
      external: [
        ['path', { d: 'M7 2.2h6.8v6.8M13.8 2.2 7.2 8.8' }],
        ['path', { d: 'M11.2 9.4v4.4H2.2V4.8h4.2' }],
      ],
      trash: [
        ['path', { d: 'M2.5 4h11M6 1.8h4M4 4l.7 10.2h6.6L12 4' }],
        ['path', { d: 'M6.4 6.4v5M9.6 6.4v5' }],
      ],
      undo: [
        ['path', { d: 'M3 5.6h6.2a3.8 3.8 0 0 1 0 7.6H6.2' }],
        ['path', { d: 'M5.6 3.2 3 5.6l2.6 2.4' }],
      ],
      warning: [
        ['path', { d: 'M8 2 1.8 13.2h12.4Z' }],
        ['path', { d: 'M8 6v3.4M8 11.4v.2' }],
      ],
      error: [
        ['circle', { cx: 8, cy: 8, r: 5.8 }],
        ['path', { d: 'M8 4.6v4.2M8 11.2v.2' }],
      ],
      info: [
        ['circle', { cx: 8, cy: 8, r: 5.8 }],
        ['path', { d: 'M8 7.2v4M8 4.6v.2' }],
      ],
      user: [
        ['circle', { cx: 8, cy: 5.2, r: 2.6 }],
        ['path', { d: 'M2.8 13.8c.6-2.7 2.6-4.2 5.2-4.2s4.6 1.5 5.2 4.2' }],
      ],
      calendar: [
        ['path', { d: 'M2 3.5h12v10.3H2Z' }],
        ['path', { d: 'M2 6.5h12M5 2v3M11 2v3' }],
      ],
      pin: [
        ['path', { d: 'M8 1.8a3.4 3.4 0 0 0-3.4 3.4c0 2.4 3.4 6.6 3.4 6.6s3.4-4.2 3.4-6.6A3.4 3.4 0 0 0 8 1.8Z' }],
        ['circle', { cx: 8, cy: 5.2, r: 1.2 }],
        ['path', { d: 'M4.4 10.6c.9 2 2.2 3 3.6 3s2.7-1 3.6-3' }],
      ],
      filter: [['path', { d: 'M2 3h12L9.3 8.2v4.6L6.7 11V8.2Z' }]],
      settings: [
        ['circle', { cx: 8, cy: 8, r: 2.2 }],
        ['path', { d: 'M8 1.8v1.6M8 12.6v1.6M1.8 8h1.6M12.6 8h1.6M3.6 3.6l1.2 1.2M11.2 11.2l1.2 1.2M12.4 3.6l-1.2 1.2M4.8 11.2l-1.2 1.2' }],
      ],
      arrowLeft: [['path', { d: 'M13 8H3M7 4 3 8l4 4' }]],
      arrowRight: [['path', { d: 'M3 8h10M9 4l4 4-4 4' }]],
      arrowUp: [['path', { d: 'M8 13V3M4 7l4-4 4 4' }]],
      arrowDown: [['path', { d: 'M8 3v10M4 9l4 4 4-4' }]],
    }

    function Icon({ name, size = 16, className, style }) {
      const definition = ICONS[name] || ICONS.commit
      return h('svg', {
        className: cx('ig-icon', className),
        style,
        width: size,
        height: size,
        viewBox: '0 0 16 16',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.45,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        focusable: false,
      }, definition.map(([tag, attrs], index) => h(tag, { key: index, ...attrs })))
    }

    function SidebarIcon({ size, active }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 22 22',
        'aria-hidden': true,
        focusable: false,
      },
      h('path', { d: 'M5.5 4.2v10.8', stroke: active ? 'var(--dsw-alias-brand-primary)' : 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', opacity: 0.9 }),
      h('path', { d: 'M5.5 9h4.2c3.4 0 6.1-2.2 6.1-4.6', stroke: active ? 'var(--dsw-alias-brand-primary)' : 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', opacity: 0.55 }),
      h('circle', { cx: 5.5, cy: 3.8, r: 2, fill: active ? 'var(--dsw-alias-brand-primary)' : 'currentColor' }),
      h('circle', { cx: 5.5, cy: 18.2, r: 2, fill: active ? 'var(--dsw-alias-brand-primary)' : 'currentColor', opacity: 0.55 }),
      h('circle', { cx: 16.2, cy: 4.2, r: 2, fill: active ? 'var(--dsw-alias-brand-primary)' : 'currentColor', opacity: 0.8 }))
    }

    const CSS = `
.ig-root{position:relative;display:flex;flex-direction:column;height:100%;min-height:420px;overflow:hidden;background:var(--dsw-alias-bg-base,#17181b);color:var(--dsw-alias-label-primary,#dedede);font-family:inherit;font-size:12px;line-height:1.45;box-sizing:border-box}
.ig-root *,.ig-root *::before,.ig-root *::after{box-sizing:border-box}
.ig-root button,.ig-root input,.ig-root textarea,.ig-root select{font:inherit;color:inherit}
.ig-root button{cursor:pointer}
.ig-icon{display:block;flex:none}
.ig-mono{font-family:ui-monospace,SFMono-Regular,"Cascadia Mono","Cascadia Code",Consolas,"Liberation Mono",monospace}
.ig-dim{color:var(--dsw-alias-label-secondary,#9aa0a6)}
.ig-brand{color:var(--dsw-alias-brand-primary,#4c8dff)}
.ig-ellipsis{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ig-hdr{display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237);background:var(--dsw-alias-bg-layer-1,#202124);flex:none;min-height:46px}
.ig-logo{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:7px;background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 14%,transparent);color:var(--dsw-alias-brand-primary,#4c8dff);flex:none}
.ig-title{font-weight:600;font-size:13px;letter-spacing:.1px;white-space:nowrap}
.ig-repo{display:flex;align-items:center;gap:6px;padding:4px 8px;border:1px solid var(--dsw-alias-border-l1,#303237);border-radius:6px;background:var(--dsw-alias-bg-layer-2,#292a2e);max-width:320px;min-width:0}
.ig-repo:hover{border-color:var(--dsw-alias-border-l2,#484b52);background:var(--dsw-alias-bg-layer-2,#292a2e)}
.ig-repo-name{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px}
.ig-repo-path{color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px;direction:rtl;text-align:left}
.ig-branch-chip{display:flex;align-items:center;gap:5px;padding:4px 8px;border:1px solid var(--dsw-alias-border-l1,#303237);border-radius:6px;background:transparent;max-width:230px}
.ig-branch-chip:hover{background:var(--dsw-alias-bg-layer-2,#292a2e)}
.ig-tracking{display:flex;align-items:center;gap:3px;font-size:11px;color:var(--dsw-alias-label-secondary,#9aa0a6)}
.ig-tracking .ig-ahead{color:var(--dsw-alias-state-success-primary,#4cb782)}
.ig-tracking .ig-behind{color:var(--dsw-alias-state-warn-primary,#d8a23a)}
.ig-toolbar{display:flex;align-items:center;gap:4px;margin-left:auto;flex:none}
.ig-iconbtn{display:inline-flex;align-items:center;justify-content:center;gap:5px;height:26px;min-width:26px;padding:0 6px;border:1px solid transparent;border-radius:5px;background:transparent;color:var(--dsw-alias-label-secondary,#9aa0a6);white-space:nowrap}
.ig-iconbtn:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2,#292a2e);color:var(--dsw-alias-label-primary,#dedede);border-color:var(--dsw-alias-border-l1,#303237)}
.ig-iconbtn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4c8dff);outline-offset:-1px}
.ig-iconbtn[aria-pressed="true"],.ig-iconbtn.ig-on{background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 13%,transparent);color:var(--dsw-alias-brand-primary,#4c8dff);border-color:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 35%,transparent)}
.ig-iconbtn:disabled{opacity:.45;cursor:default}
.ig-iconbtn .ig-btn-label{font-size:11px}
.ig-badge-count{min-width:15px;height:15px;padding:0 4px;border-radius:8px;background:var(--dsw-alias-bg-layer-2,#292a2e);color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:10px;display:inline-flex;align-items:center;justify-content:center}
.ig-btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;height:26px;padding:0 10px;border:1px solid var(--dsw-alias-border-l1,#303237);border-radius:5px;background:var(--dsw-alias-bg-layer-2,#292a2e);color:var(--dsw-alias-label-primary,#dedede);white-space:nowrap}
.ig-btn:hover:not(:disabled){border-color:var(--dsw-alias-border-l2,#484b52);background:color-mix(in srgb,var(--dsw-alias-bg-layer-2,#292a2e) 80%,#fff 10%)}
.ig-btn:disabled{opacity:.45;cursor:default}
.ig-btn.ig-primary{background:var(--dsw-alias-brand-primary,#4c8dff);border-color:var(--dsw-alias-brand-primary,#4c8dff);color:#fff;font-weight:600}
.ig-btn.ig-primary:hover:not(:disabled){filter:brightness(1.08)}
.ig-btn.ig-danger{color:var(--dsw-alias-state-error-primary,#e05a5a);border-color:color-mix(in srgb,var(--dsw-alias-state-error-primary,#e05a5a) 40%,transparent)}
.ig-btn.ig-danger:hover:not(:disabled){background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#e05a5a) 12%,transparent)}
.ig-btn.ig-ghost{background:transparent;border-color:transparent;color:var(--dsw-alias-label-secondary,#9aa0a6)}
.ig-btn.ig-ghost:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2,#292a2e);color:var(--dsw-alias-label-primary,#dedede)}
.ig-btn.ig-small{height:23px;padding:0 7px;font-size:11px}
.ig-tabs{display:flex;align-items:center;gap:2px;padding:0 8px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237);background:var(--dsw-alias-bg-layer-1,#202124);flex:none;min-height:34px;overflow-x:auto;scrollbar-width:none}
.ig-tabs::-webkit-scrollbar{display:none}
.ig-tab{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 10px;border:0;border-bottom:2px solid transparent;background:transparent;color:var(--dsw-alias-label-secondary,#9aa0a6);white-space:nowrap;font-size:12px}
.ig-tab:hover{color:var(--dsw-alias-label-primary,#dedede)}
.ig-tab.ig-active{color:var(--dsw-alias-label-primary,#dedede);border-bottom-color:var(--dsw-alias-brand-primary,#4c8dff)}
.ig-tab .ig-tab-count{font-size:10px;padding:1px 5px;border-radius:7px;background:var(--dsw-alias-bg-layer-2,#292a2e);color:var(--dsw-alias-label-secondary,#9aa0a6)}
.ig-content{position:relative;display:flex;flex:1;min-height:0;overflow:hidden}
.ig-banner{display:flex;align-items:center;gap:8px;padding:6px 12px;background:color-mix(in srgb,var(--dsw-alias-state-warn-primary,#d8a23a) 13%,transparent);border-bottom:1px solid color-mix(in srgb,var(--dsw-alias-state-warn-primary,#d8a23a) 30%,transparent);color:var(--dsw-alias-state-warn-primary,#d8a23a);font-size:12px;flex:none}
.ig-banner .ig-spacer{flex:1}
.ig-status{display:flex;align-items:center;gap:10px;padding:4px 10px;border-top:1px solid var(--dsw-alias-border-l1,#303237);background:var(--dsw-alias-bg-layer-1,#202124);color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:11px;flex:none;min-height:25px;overflow:hidden;white-space:nowrap}
.ig-status .ig-spacer{flex:1}
.ig-status-dot{width:7px;height:7px;border-radius:50%;background:var(--dsw-alias-state-success-primary,#4cb782);flex:none}
.ig-status-dot.ig-dirty{background:var(--dsw-alias-state-warn-primary,#d8a23a)}
.ig-log{display:flex;flex:1;min-width:0;min-height:0}
.ig-refs{display:flex;flex-direction:column;width:218px;min-width:170px;max-width:300px;border-right:1px solid var(--dsw-alias-border-l1,#303237);background:var(--dsw-alias-bg-layer-1,#202124);flex:none;min-height:0}
.ig-refs-top{padding:7px 8px;display:flex;flex-direction:column;gap:6px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237)}
.ig-input{display:flex;align-items:center;gap:5px;height:25px;padding:0 7px;border:1px solid var(--dsw-alias-border-l1,#303237);border-radius:5px;background:var(--dsw-alias-bg-base,#17181b);min-width:0}
.ig-input:focus-within{border-color:var(--dsw-alias-brand-primary,#4c8dff)}
.ig-input input{flex:1;min-width:0;border:0;background:transparent;outline:none;font-size:11px;color:var(--dsw-alias-label-primary,#dedede)}
.ig-input input::placeholder{color:var(--dsw-alias-label-secondary,#9aa0a6)}
.ig-input .ig-icon{color:var(--dsw-alias-label-secondary,#9aa0a6)}
.ig-input-clear{display:flex;align-items:center;justify-content:center;width:16px;height:16px;border:0;padding:0;background:transparent;color:var(--dsw-alias-label-secondary,#9aa0a6)}
.ig-refs-scroll{flex:1;overflow:auto;padding:4px 0 10px;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-border-l2,#484b52) transparent}
.ig-refs-scroll::-webkit-scrollbar{width:9px;height:9px}
.ig-refs-scroll::-webkit-scrollbar-thumb{background:var(--dsw-alias-border-l2,#484b52);border-radius:5px;border:2px solid transparent;background-clip:padding-box}
.ig-ref-group{margin-top:2px}
.ig-ref-group-hdr{display:flex;align-items:center;gap:5px;width:100%;padding:4px 8px;border:0;background:transparent;color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:10.5px;text-transform:uppercase;letter-spacing:.05em}
.ig-ref-group-hdr:hover{color:var(--dsw-alias-label-primary,#dedede)}
.ig-ref-group-hdr .ig-count{margin-left:auto;font-size:10px;text-transform:none;letter-spacing:0}
.ig-ref-row{display:flex;align-items:center;gap:6px;width:100%;padding:3px 8px 3px 10px;border:0;background:transparent;color:var(--dsw-alias-label-primary,#dedede);text-align:left;font-size:11.5px;position:relative;min-height:23px}
.ig-ref-row:hover{background:var(--dsw-alias-bg-layer-2,#292a2e)}
.ig-ref-row.ig-active{background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 13%,transparent);color:var(--dsw-alias-brand-primary,#4c8dff)}
.ig-ref-row.ig-active::before{content:"";position:absolute;left:0;top:3px;bottom:3px;width:2px;border-radius:2px;background:var(--dsw-alias-brand-primary,#4c8dff)}
.ig-ref-row .ig-ref-icon{color:var(--dsw-alias-label-secondary,#9aa0a6);flex:none}
.ig-ref-row.ig-active .ig-ref-icon{color:var(--dsw-alias-brand-primary,#4c8dff)}
.ig-ref-row-main{display:flex;flex-direction:column;min-width:0;flex:1;gap:0}
.ig-ref-row-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ig-ref-row-meta{font-size:9.5px;color:var(--dsw-alias-label-secondary,#9aa0a6);display:flex;gap:4px;align-items:center;line-height:1.2}
.ig-ref-row-actions{display:none;gap:1px;margin-left:auto;flex:none}
.ig-ref-row:hover .ig-ref-row-actions{display:flex}
.ig-ref-row .ig-head-mark{color:var(--dsw-alias-brand-primary,#4c8dff);flex:none}
.ig-ref-all{display:flex;align-items:center;gap:6px;width:100%;padding:5px 8px;border:0;background:transparent;color:var(--dsw-alias-label-primary,#dedede);text-align:left;font-size:11.5px}
.ig-ref-all:hover{background:var(--dsw-alias-bg-layer-2,#292a2e)}
.ig-ref-all.ig-active{background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 13%,transparent);color:var(--dsw-alias-brand-primary,#4c8dff)}
.ig-log-main{display:flex;flex-direction:column;flex:1;min-width:0;min-height:0;background:var(--dsw-alias-bg-base,#17181b)}
.ig-log-toolbar{display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237);flex:none;min-height:38px;flex-wrap:wrap}
.ig-log-toolbar .ig-search{flex:1;min-width:150px;max-width:420px}
.ig-filter-row{display:flex;align-items:center;gap:6px;padding:5px 8px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237);background:var(--dsw-alias-bg-layer-1,#202124);flex:none;flex-wrap:wrap}
.ig-filter-row .ig-input{width:150px}
.ig-filter-row .ig-input.ig-wide{width:190px}
.ig-toggle{display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 6px;border:1px solid transparent;border-radius:5px;background:transparent;color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:11px;white-space:nowrap}
.ig-toggle:hover{color:var(--dsw-alias-label-primary,#dedede);background:var(--dsw-alias-bg-layer-2,#292a2e)}
.ig-toggle.ig-on{color:var(--dsw-alias-brand-primary,#4c8dff);background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 11%,transparent)}
.ig-table{display:flex;flex-direction:column;flex:1;min-height:0;min-width:0}
.ig-thead{display:grid;grid-template-columns:var(--ig-cols,120px minmax(180px,1fr) 128px 100px 78px);align-items:center;height:25px;padding:0 8px 0 0;border-bottom:1px solid var(--dsw-alias-border-l1,#303237);background:var(--dsw-alias-bg-layer-1,#202124);color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:10.5px;text-transform:uppercase;letter-spacing:.04em;flex:none;user-select:none}
.ig-thead > span{padding-left:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ig-thead > span:first-child{padding-left:0}
.ig-scroll{flex:1;overflow:auto;min-height:0;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-border-l2,#484b52) transparent;outline:none}
.ig-scroll::-webkit-scrollbar{width:10px;height:10px}
.ig-scroll::-webkit-scrollbar-thumb{background:var(--dsw-alias-border-l2,#484b52);border-radius:6px;border:2px solid transparent;background-clip:padding-box}
.ig-row{display:grid;grid-template-columns:var(--ig-cols,120px minmax(180px,1fr) 128px 100px 78px);align-items:center;height:${ROW_H}px;padding:0 8px 0 0;border-bottom:1px solid color-mix(in srgb,var(--dsw-alias-border-l1,#303237) 55%,transparent);cursor:default;user-select:none;position:relative;background:transparent}
.ig-row:hover{background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 6%,transparent)}
.ig-row.ig-selected{background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 15%,transparent)}
.ig-row.ig-selected::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--dsw-alias-brand-primary,#4c8dff)}
.ig-graph{height:${ROW_H}px;overflow:hidden;flex:none}
.ig-subject{display:flex;align-items:center;gap:6px;min-width:0;overflow:hidden;padding-left:2px}
.ig-subject-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:0 1 auto;min-width:0}
.ig-badges{display:flex;align-items:center;gap:3px;flex:none;max-width:55%;overflow:hidden}
.ig-badge{display:inline-flex;align-items:center;gap:3px;height:17px;padding:0 5px;border-radius:4px;font-size:10px;line-height:1;white-space:nowrap;border:1px solid transparent;max-width:150px;overflow:hidden;text-overflow:ellipsis}
.ig-badge.ig-local{color:var(--dsw-alias-brand-primary,#4c8dff);background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 12%,transparent);border-color:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 24%,transparent)}
.ig-badge.ig-remote{color:var(--dsw-alias-label-secondary,#9aa0a6);background:color-mix(in srgb,var(--dsw-alias-label-secondary,#9aa0a6) 10%,transparent);border-color:color-mix(in srgb,var(--dsw-alias-label-secondary,#9aa0a6) 22%,transparent)}
.ig-badge.ig-tag{color:var(--dsw-alias-state-warn-primary,#d8a23a);background:color-mix(in srgb,var(--dsw-alias-state-warn-primary,#d8a23a) 12%,transparent);border-color:color-mix(in srgb,var(--dsw-alias-state-warn-primary,#d8a23a) 25%,transparent)}
.ig-badge.ig-head{color:var(--dsw-alias-state-success-primary,#4cb782);background:color-mix(in srgb,var(--dsw-alias-state-success-primary,#4cb782) 12%,transparent);border-color:color-mix(in srgb,var(--dsw-alias-state-success-primary,#4cb782) 25%,transparent);font-weight:600}
.ig-author{display:flex;align-items:center;gap:5px;min-width:0;padding-left:8px;color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:11px}
.ig-author span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ig-avatar{width:18px;height:18px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:8.5px;font-weight:700;color:#fff;flex:none;letter-spacing:.02em}
.ig-date{padding-left:8px;color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ig-hash{padding-left:8px;color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:10.5px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ig-loadmore{display:flex;align-items:center;justify-content:center;gap:8px;padding:8px;color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:11px;border-top:1px solid var(--dsw-alias-border-l1,#303237)}
.ig-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;flex:1;min-height:160px;padding:28px;text-align:center;color:var(--dsw-alias-label-secondary,#9aa0a6)}
.ig-empty .ig-empty-icon{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:12px;background:var(--dsw-alias-bg-layer-2,#292a2e);color:var(--dsw-alias-label-secondary,#9aa0a6)}
.ig-empty-title{color:var(--dsw-alias-label-primary,#dedede);font-weight:600;font-size:13px}
.ig-empty-text{max-width:420px;font-size:11.5px;line-height:1.6}
.ig-details{display:flex;flex-direction:column;width:380px;min-width:260px;max-width:560px;background:var(--dsw-alias-bg-layer-1,#202124);border-left:1px solid var(--dsw-alias-border-l1,#303237);flex:none;min-height:0}
.ig-details-hdr{display:flex;align-items:center;gap:6px;padding:7px 9px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237);flex:none;min-height:34px}
.ig-details-title{font-weight:600;font-size:12px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ig-details-body{flex:1;overflow:auto;min-height:0;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-border-l2,#484b52) transparent}
.ig-details-body::-webkit-scrollbar{width:9px}
.ig-details-body::-webkit-scrollbar-thumb{background:var(--dsw-alias-border-l2,#484b52);border-radius:5px;border:2px solid transparent;background-clip:padding-box}
.ig-commit-info{padding:10px 11px 8px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237)}
.ig-commit-subject{font-size:13px;font-weight:600;line-height:1.5;word-break:break-word;margin:0 0 8px}
.ig-commit-meta{display:flex;flex-direction:column;gap:5px;font-size:11px;color:var(--dsw-alias-label-secondary,#9aa0a6)}
.ig-meta-row{display:flex;align-items:center;gap:6px;min-width:0}
.ig-meta-row .ig-meta-label{width:52px;flex:none;font-size:10px;text-transform:uppercase;letter-spacing:.04em;opacity:.8}
.ig-meta-row .ig-meta-value{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary,#dedede)}
.ig-hash-chip{display:inline-flex;align-items:center;gap:4px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:10.5px;color:var(--dsw-alias-label-secondary,#9aa0a6);background:var(--dsw-alias-bg-layer-2,#292a2e);border:1px solid var(--dsw-alias-border-l1,#303237);border-radius:4px;padding:2px 5px}
.ig-hash-chip button{border:0;background:transparent;padding:0;display:flex;color:inherit}
.ig-ref-badges{display:flex;flex-wrap:wrap;gap:3px;margin-top:6px}
.ig-commit-message{padding:8px 11px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237);white-space:pre-wrap;word-break:break-word;font-size:11.5px;color:var(--dsw-alias-label-primary,#dedede);max-height:180px;overflow:auto;line-height:1.55}
.ig-commit-message:empty{display:none}
.ig-commit-stats{display:flex;align-items:center;gap:8px;padding:6px 11px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237);font-size:10.5px;color:var(--dsw-alias-label-secondary,#9aa0a6);flex:none}
.ig-add{color:var(--dsw-alias-state-success-primary,#4cb782)}
.ig-del{color:var(--dsw-alias-state-error-primary,#e05a5a)}
.ig-file-tree{padding:4px 0 8px;min-height:40px}
.ig-file-dir{display:flex;align-items:center;gap:4px;width:100%;padding:2px 8px;border:0;background:transparent;color:var(--dsw-alias-label-secondary,#9aa0a6);text-align:left;font-size:11px;min-height:22px}
.ig-file-dir:hover{color:var(--dsw-alias-label-primary,#dedede);background:var(--dsw-alias-bg-layer-2,#292a2e)}
.ig-file-row{display:flex;align-items:center;gap:5px;width:100%;padding:2px 8px;border:0;background:transparent;color:var(--dsw-alias-label-primary,#dedede);text-align:left;font-size:11px;min-height:23px}
.ig-file-row:hover{background:var(--dsw-alias-bg-layer-2,#292a2e)}
.ig-file-row.ig-active{background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 12%,transparent)}
.ig-file-row .ig-file-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0}
.ig-file-row .ig-file-dirname{color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:9.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:110px}
.ig-status-chip{display:inline-flex;align-items:center;justify-content:center;width:16px;height:15px;border-radius:3px;font-size:9.5px;font-weight:700;flex:none;line-height:1}
.ig-status-chip.ig-ok{color:var(--dsw-alias-state-success-primary,#4cb782);background:color-mix(in srgb,var(--dsw-alias-state-success-primary,#4cb782) 13%,transparent)}
.ig-status-chip.ig-warn{color:var(--dsw-alias-state-warn-primary,#d8a23a);background:color-mix(in srgb,var(--dsw-alias-state-warn-primary,#d8a23a) 13%,transparent)}
.ig-status-chip.ig-err{color:var(--dsw-alias-state-error-primary,#e05a5a);background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#e05a5a) 13%,transparent)}
.ig-status-chip.ig-info{color:var(--dsw-alias-brand-primary,#4c8dff);background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 13%,transparent)}
.ig-splitter{width:5px;flex:none;cursor:col-resize;background:transparent;position:relative;z-index:2;margin-left:-3px}
.ig-splitter:hover::after{content:"";position:absolute;inset:0 2px;background:var(--dsw-alias-brand-primary,#4c8dff);opacity:.5}
.ig-diff-overlay{position:absolute;inset:0;z-index:30;display:flex;flex-direction:column;background:var(--dsw-alias-bg-base,#17181b);min-height:0}
.ig-diff-hdr{display:flex;align-items:center;gap:8px;padding:7px 10px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237);background:var(--dsw-alias-bg-layer-1,#202124);flex:none;min-height:40px;flex-wrap:wrap}
.ig-diff-title{display:flex;align-items:center;gap:6px;min-width:0;flex:1}
.ig-diff-title .ig-diff-file{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ig-diff-title .ig-diff-context{font-size:10.5px;color:var(--dsw-alias-label-secondary,#9aa0a6);white-space:nowrap}
.ig-seg{display:inline-flex;align-items:center;border:1px solid var(--dsw-alias-border-l1,#303237);border-radius:5px;overflow:hidden;height:25px}
.ig-seg button{border:0;border-right:1px solid var(--dsw-alias-border-l1,#303237);background:transparent;color:var(--dsw-alias-label-secondary,#9aa0a6);height:100%;padding:0 8px;font-size:11px;display:inline-flex;align-items:center;gap:4px}
.ig-seg button:last-child{border-right:0}
.ig-seg button:hover{background:var(--dsw-alias-bg-layer-2,#292a2e);color:var(--dsw-alias-label-primary,#dedede)}
.ig-seg button.ig-active{background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 15%,transparent);color:var(--dsw-alias-brand-primary,#4c8dff)}
.ig-diff-body{flex:1;overflow:auto;min-height:0;background:var(--dsw-alias-bg-base,#17181b);scrollbar-width:thin;scrollbar-color:var(--dsw-alias-border-l2,#484b52) transparent}
.ig-diff-body::-webkit-scrollbar{width:11px;height:11px}
.ig-diff-body::-webkit-scrollbar-thumb{background:var(--dsw-alias-border-l2,#484b52);border-radius:6px;border:2px solid transparent;background-clip:padding-box}
.ig-diff-table{min-width:100%;font-family:ui-monospace,SFMono-Regular,"Cascadia Mono",Consolas,monospace;font-size:11.5px;line-height:18px;border-collapse:collapse;table-layout:fixed}
.ig-diff-table td{border:0;padding:0;vertical-align:top}
.ig-diff-line{display:flex;min-height:18px;white-space:pre}
.ig-diff-table .ig-gutter{width:44px;min-width:44px;text-align:right;padding-right:8px;color:var(--dsw-alias-label-secondary,#9aa0a6);opacity:.65;user-select:none;font-size:10.5px;line-height:18px}
.ig-diff-table .ig-sign{width:18px;min-width:18px;text-align:center;color:var(--dsw-alias-label-secondary,#9aa0a6);user-select:none;line-height:18px}
.ig-diff-table .ig-code{white-space:pre;padding-right:12px;overflow:hidden;text-overflow:clip;line-height:18px}
.ig-diff-table tr.ig-add-row td{background:color-mix(in srgb,var(--dsw-alias-state-success-primary,#4cb782) 10%,transparent)}
.ig-diff-table tr.ig-del-row td{background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#e05a5a) 9%,transparent)}
.ig-diff-table tr.ig-hunk-row td{background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 9%,transparent);color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:10.5px;padding:2px 8px;line-height:18px;border-top:1px solid var(--dsw-alias-border-l1,#303237);border-bottom:1px solid var(--dsw-alias-border-l1,#303237)}
.ig-diff-table tr.ig-meta-row td{color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:10.5px;padding:2px 8px;line-height:18px}
.ig-word-add{background:color-mix(in srgb,var(--dsw-alias-state-success-primary,#4cb782) 30%,transparent);border-radius:2px}
.ig-word-del{background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#e05a5a) 28%,transparent);border-radius:2px}
.ig-diff-split{width:100%;min-width:900px;border-collapse:collapse;table-layout:fixed}
.ig-diff-split td{border:0;padding:0;vertical-align:top}
.ig-diff-split .ig-split-side{width:50%;border-left:1px solid var(--dsw-alias-border-l1,#303237)}
.ig-diff-split .ig-split-cell{display:flex;min-height:18px;white-space:pre}
.ig-diff-split .ig-gutter{width:42px;min-width:42px;text-align:right;padding-right:7px;color:var(--dsw-alias-label-secondary,#9aa0a6);opacity:.65;font-size:10.5px;user-select:none}
.ig-diff-split .ig-code{white-space:pre;overflow:hidden;padding-right:10px;flex:1;min-width:0}
.ig-diff-split tr.ig-add-row .ig-right{background:color-mix(in srgb,var(--dsw-alias-state-success-primary,#4cb782) 10%,transparent)}
.ig-diff-split tr.ig-del-row .ig-left{background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#e05a5a) 9%,transparent)}
.ig-diff-split tr.ig-pair-row .ig-left{background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#e05a5a) 8%,transparent)}
.ig-diff-split tr.ig-pair-row .ig-right{background:color-mix(in srgb,var(--dsw-alias-state-success-primary,#4cb782) 9%,transparent)}
.ig-diff-split tr.ig-hunk-row td{background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 9%,transparent);color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:10.5px;padding:2px 8px;border-top:1px solid var(--dsw-alias-border-l1,#303237);border-bottom:1px solid var(--dsw-alias-border-l1,#303237)}
.ig-hunk-check{display:inline-flex;align-items:center;gap:6px;cursor:pointer;user-select:none;max-width:100%}
.ig-hunk-check input{accent-color:var(--dsw-alias-brand-primary,#4c8dff);margin:0;width:12px;height:12px;flex:none;cursor:pointer}
.ig-hunk-check .ig-hunk-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:ui-monospace,SFMono-Regular,Consolas,monospace}
.ig-hunk-check.ig-checked .ig-hunk-label{color:var(--dsw-alias-brand-primary,#4c8dff)}
.ig-trailers{padding:7px 11px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237)}
.ig-trailers-label{font-size:9.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--dsw-alias-label-secondary,#9aa0a6);margin-bottom:4px}
.ig-trailer-list{display:flex;flex-wrap:wrap;gap:4px}
.ig-trailer-chip{display:inline-flex;align-items:center;gap:4px;max-width:100%;height:20px;padding:0 4px 0 6px;border:1px solid var(--dsw-alias-border-l1,#303237);border-radius:4px;background:var(--dsw-alias-bg-layer-2,#292a2e);font-size:10px;line-height:1;min-width:0}
.ig-trailer-key{color:var(--dsw-alias-label-secondary,#9aa0a6);flex:none;font-weight:600}
.ig-trailer-value{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-label-primary,#dedede)}
.ig-trailer-chip.ig-trailer-ai{border-color:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 40%,transparent);background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 12%,transparent)}
.ig-trailer-chip.ig-trailer-ai .ig-trailer-key{color:var(--dsw-alias-brand-primary,#4c8dff)}
.ig-trailer-chip.ig-trailer-ok{border-color:color-mix(in srgb,var(--dsw-alias-state-success-primary,#4cb782) 32%,transparent)}
.ig-trailer-chip.ig-trailer-ok .ig-trailer-key{color:var(--dsw-alias-state-success-primary,#4cb782)}
.ig-trailer-chip.ig-trailer-info .ig-trailer-key{color:var(--dsw-alias-label-secondary,#9aa0a6)}
.ig-trailer-copy{display:flex;align-items:center;justify-content:center;width:15px;height:15px;padding:0;border:0;border-radius:3px;background:transparent;color:var(--dsw-alias-label-secondary,#9aa0a6);flex:none;opacity:.55}
.ig-trailer-copy:hover{opacity:1;background:color-mix(in srgb,var(--dsw-alias-label-primary,#dedede) 12%,transparent);color:var(--dsw-alias-label-primary,#dedede)}
.ig-loc-chip{display:inline-flex;align-items:center;height:19px;padding:0 5px;border-radius:4px;background:var(--dsw-alias-bg-layer-2,#292a2e);border:1px solid var(--dsw-alias-border-l1,#303237);color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:9.5px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;flex:none;white-space:nowrap}
.ig-line-selected td{background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 16%,transparent)!important}
.ig-diff-table tr,.ig-diff-split tr{cursor:default}
.ig-diff-table tr.ig-line-selected,.ig-diff-split tr.ig-line-selected{cursor:pointer}
.ig-blame-copy{opacity:0}
.ig-blame-row:hover .ig-blame-copy{opacity:.75}
.ig-blame-copy:hover{opacity:1}
.ig-changes{display:flex;flex:1;min-width:0;min-height:0}
.ig-changes-list{display:flex;flex-direction:column;width:390px;min-width:260px;max-width:520px;border-right:1px solid var(--dsw-alias-border-l1,#303237);background:var(--dsw-alias-bg-layer-1,#202124);min-height:0;flex:none}
.ig-changes-hdr{display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237);flex:none;min-height:36px}
.ig-changes-scroll{flex:1;overflow:auto;min-height:0;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-border-l2,#484b52) transparent}
.ig-changes-scroll::-webkit-scrollbar{width:9px}
.ig-changes-scroll::-webkit-scrollbar-thumb{background:var(--dsw-alias-border-l2,#484b52);border-radius:5px;border:2px solid transparent;background-clip:padding-box}
.ig-change-group{border-bottom:1px solid var(--dsw-alias-border-l1,#303237)}
.ig-change-group-hdr{display:flex;align-items:center;gap:6px;padding:5px 8px;background:var(--dsw-alias-bg-layer-2,#292a2e);color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:10.5px;text-transform:uppercase;letter-spacing:.04em;position:sticky;top:0;z-index:1;min-height:25px}
.ig-change-group-hdr .ig-count{font-size:10px;text-transform:none;letter-spacing:0}
.ig-change-group-hdr .ig-spacer{flex:1}
.ig-change-row{display:flex;align-items:center;gap:6px;padding:2px 8px 2px 6px;min-height:25px;font-size:11.5px;cursor:default;position:relative}
.ig-change-row:hover{background:var(--dsw-alias-bg-layer-2,#292a2e)}
.ig-change-row.ig-active{background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 12%,transparent)}
.ig-change-check{width:14px;height:14px;border:1px solid var(--dsw-alias-border-l2,#484b52);border-radius:3px;display:inline-flex;align-items:center;justify-content:center;flex:none;color:transparent;background:transparent;padding:0}
.ig-change-check.ig-checked{background:var(--dsw-alias-brand-primary,#4c8dff);border-color:var(--dsw-alias-brand-primary,#4c8dff);color:#fff}
.ig-change-name{min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ig-change-dir{color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:9.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:135px}
.ig-change-actions{display:none;gap:1px;flex:none}
.ig-change-row:hover .ig-change-actions{display:flex}
.ig-changes-main{display:flex;flex-direction:column;flex:1;min-width:0;min-height:0}
.ig-commit-card{border-bottom:1px solid var(--dsw-alias-border-l1,#303237);padding:8px 10px;background:var(--dsw-alias-bg-layer-1,#202124);flex:none}
.ig-commit-card-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap}
.ig-commit-card-row .ig-spacer{flex:1}
.ig-textarea{width:100%;min-height:64px;max-height:160px;resize:vertical;border:1px solid var(--dsw-alias-border-l1,#303237);border-radius:6px;background:var(--dsw-alias-bg-base,#17181b);color:var(--dsw-alias-label-primary,#dedede);padding:7px 8px;font-size:12px;line-height:1.5;outline:none;font-family:inherit}
.ig-textarea:focus{border-color:var(--dsw-alias-brand-primary,#4c8dff)}
.ig-textarea::placeholder{color:var(--dsw-alias-label-secondary,#9aa0a6)}
.ig-check{display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--dsw-alias-label-secondary,#9aa0a6);cursor:pointer;user-select:none}
.ig-check input{accent-color:var(--dsw-alias-brand-primary,#4c8dff);margin:0}
.ig-commit-actions{display:flex;align-items:center;gap:6px;margin-top:6px;flex-wrap:wrap}
.ig-inline-diff{flex:1;min-height:0;display:flex;flex-direction:column;border-top:1px solid var(--dsw-alias-border-l1,#303237)}
.ig-inline-diff-hdr{display:flex;align-items:center;gap:6px;padding:5px 8px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237);background:var(--dsw-alias-bg-base,#17181b);flex:none;min-height:32px;flex-wrap:wrap}
.ig-inline-diff-body{flex:1;overflow:auto;min-height:0;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-border-l2,#484b52) transparent}
.ig-inline-diff-body::-webkit-scrollbar{width:10px;height:10px}
.ig-inline-diff-body::-webkit-scrollbar-thumb{background:var(--dsw-alias-border-l2,#484b52);border-radius:5px;border:2px solid transparent;background-clip:padding-box}
.ig-file-picker{display:flex;flex-direction:column;width:270px;min-width:210px;max-width:360px;border-right:1px solid var(--dsw-alias-border-l1,#303237);background:var(--dsw-alias-bg-layer-1,#202124);min-height:0;flex:none}
.ig-picker-hdr{padding:6px 8px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237);flex:none}
.ig-picker-scroll{flex:1;overflow:auto;min-height:0;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-border-l2,#484b52) transparent}
.ig-picker-scroll::-webkit-scrollbar{width:9px}
.ig-picker-scroll::-webkit-scrollbar-thumb{background:var(--dsw-alias-border-l2,#484b52);border-radius:5px;border:2px solid transparent;background-clip:padding-box}
.ig-picker-row{display:flex;align-items:center;gap:5px;width:100%;padding:1px 8px 1px 6px;border:0;background:transparent;color:var(--dsw-alias-label-primary,#dedede);text-align:left;font-size:11px;height:23px;white-space:nowrap}
.ig-picker-row:hover{background:var(--dsw-alias-bg-layer-2,#292a2e)}
.ig-picker-row.ig-active{background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 13%,transparent);color:var(--dsw-alias-brand-primary,#4c8dff)}
.ig-picker-row .ig-picker-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;flex:1}
.ig-picker-row.ig-dir{color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:10.5px}
.ig-picker-count{padding:4px 8px;color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:10px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237)}
.ig-history{display:flex;flex:1;min-width:0;min-height:0;flex-direction:column}
.ig-history-hdr{display:flex;align-items:center;gap:8px;padding:6px 9px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237);background:var(--dsw-alias-bg-layer-1,#202124);flex:none;min-height:38px;flex-wrap:wrap}
.ig-history-hdr .ig-spacer{flex:1}
.ig-history-body{display:flex;flex:1;min-height:0}
.ig-history-list{flex:1;overflow:auto;min-width:0;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-border-l2,#484b52) transparent}
.ig-history-list::-webkit-scrollbar{width:10px}
.ig-history-list::-webkit-scrollbar-thumb{background:var(--dsw-alias-border-l2,#484b52);border-radius:5px;border:2px solid transparent;background-clip:padding-box}
.ig-history-row{display:grid;grid-template-columns:minmax(180px,1fr) 120px 100px 76px;gap:6px;align-items:center;height:30px;padding:0 9px;border-bottom:1px solid color-mix(in srgb,var(--dsw-alias-border-l1,#303237) 55%,transparent);font-size:11.5px;cursor:default}
.ig-history-row:hover{background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 6%,transparent)}
.ig-history-row.ig-selected{background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 15%,transparent)}
.ig-history-row .ig-ellipsis{min-width:0}
.ig-blame{display:flex;flex:1;min-width:0;min-height:0}
.ig-blame-main{display:flex;flex-direction:column;flex:1;min-width:0;min-height:0}
.ig-blame-hdr{display:flex;align-items:center;gap:8px;padding:6px 9px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237);background:var(--dsw-alias-bg-layer-1,#202124);flex:none;min-height:38px;flex-wrap:wrap}
.ig-blame-hdr .ig-spacer{flex:1}
.ig-blame-scroll{flex:1;overflow:auto;min-height:0;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:11.5px;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-border-l2,#484b52) transparent}
.ig-blame-scroll::-webkit-scrollbar{width:10px;height:10px}
.ig-blame-scroll::-webkit-scrollbar-thumb{background:var(--dsw-alias-border-l2,#484b52);border-radius:5px;border:2px solid transparent;background-clip:padding-box}
.ig-blame-row{display:grid;grid-template-columns:76px 118px 96px 48px minmax(200px,1fr) 24px;align-items:center;min-height:19px;border-bottom:1px solid color-mix(in srgb,var(--dsw-alias-border-l1,#303237) 35%,transparent);white-space:nowrap;cursor:default;position:relative}
.ig-blame-row:hover{background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 7%,transparent)}
.ig-blame-row.ig-selected{background:color-mix(in srgb,var(--dsw-alias-brand-primary,#4c8dff) 13%,transparent)}
.ig-blame-row > span{padding:0 6px;overflow:hidden;text-overflow:ellipsis}
.ig-blame-row .ig-blame-hash{color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:10px}
.ig-blame-row .ig-blame-author{font-family:inherit;font-size:10.5px}
.ig-blame-row .ig-blame-date{color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:10px}
.ig-blame-row .ig-blame-line{text-align:right;color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:10px;padding-right:8px}
.ig-blame-row .ig-blame-code{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:11px;padding-left:8px;overflow:hidden;text-overflow:clip}
.ig-blame-row .ig-blame-bar{position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:0 2px 2px 0}
.ig-blame-first{border-top:1px solid var(--dsw-alias-border-l1,#303237)}
.ig-stash{display:flex;flex:1;min-width:0;min-height:0;flex-direction:column}
.ig-stash-hdr{display:flex;align-items:center;gap:8px;padding:6px 9px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237);background:var(--dsw-alias-bg-layer-1,#202124);flex:none;min-height:38px}
.ig-stash-hdr .ig-spacer{flex:1}
.ig-stash-list{flex:1;overflow:auto;min-height:0;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-border-l2,#484b52) transparent}
.ig-stash-list::-webkit-scrollbar{width:10px}
.ig-stash-list::-webkit-scrollbar-thumb{background:var(--dsw-alias-border-l2,#484b52);border-radius:5px;border:2px solid transparent;background-clip:padding-box}
.ig-stash-row{display:flex;align-items:center;gap:9px;padding:7px 10px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237);min-height:42px}
.ig-stash-row:hover{background:var(--dsw-alias-bg-layer-2,#292a2e)}
.ig-stash-index{display:inline-flex;align-items:center;justify-content:center;min-width:24px;height:20px;border-radius:4px;background:var(--dsw-alias-bg-layer-2,#292a2e);color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:10px;font-family:ui-monospace,Consolas,monospace;flex:none}
.ig-stash-main{flex:1;min-width:0}
.ig-stash-subject{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11.5px}
.ig-stash-meta{color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:10px;margin-top:1px}
.ig-stash-actions{display:flex;gap:2px;flex:none}
.ig-console{display:flex;flex:1;min-width:0;min-height:0;flex-direction:column}
.ig-console-hdr{display:flex;align-items:center;gap:8px;padding:6px 9px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237);background:var(--dsw-alias-bg-layer-1,#202124);flex:none;min-height:36px}
.ig-console-hdr .ig-spacer{flex:1}
.ig-console-list{flex:1;overflow:auto;min-height:0;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:11px;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-border-l2,#484b52) transparent}
.ig-console-list::-webkit-scrollbar{width:10px}
.ig-console-list::-webkit-scrollbar-thumb{background:var(--dsw-alias-border-l2,#484b52);border-radius:5px;border:2px solid transparent;background-clip:padding-box}
.ig-console-row{border-bottom:1px solid var(--dsw-alias-border-l1,#303237);padding:3px 9px}
.ig-console-line{display:flex;align-items:center;gap:7px;min-height:19px}
.ig-console-line .ig-method{color:var(--dsw-alias-brand-primary,#4c8dff);min-width:74px}
.ig-console-line .ig-cmd{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary,#9aa0a6)}
.ig-console-line .ig-ok{color:var(--dsw-alias-state-success-primary,#4cb782)}
.ig-console-line .ig-fail{color:var(--dsw-alias-state-error-primary,#e05a5a)}
.ig-console-detail{padding:3px 0 4px 81px;white-space:pre-wrap;word-break:break-word;color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:10.5px;line-height:1.5}
.ig-spinner{display:inline-block;width:14px;height:14px;border:1.6px solid color-mix(in srgb,currentColor 25%,transparent);border-top-color:currentColor;border-radius:50%;animation:ig-spin .7s linear infinite;flex:none}
@keyframes ig-spin{to{transform:rotate(360deg)}}
.ig-skeleton{height:11px;border-radius:4px;background:linear-gradient(90deg,var(--dsw-alias-bg-layer-2,#292a2e) 25%,color-mix(in srgb,var(--dsw-alias-bg-layer-2,#292a2e) 70%,#fff 8%) 50%,var(--dsw-alias-bg-layer-2,#292a2e) 75%);background-size:200% 100%;animation:ig-shimmer 1.2s ease-in-out infinite;margin:6px 0}
@keyframes ig-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
.ig-overlay{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.42);display:flex;align-items:flex-start;justify-content:center;padding:8vh 16px;overflow:auto}
.ig-modal{width:min(460px,100%);background:var(--dsw-alias-bg-overlay,#2b2d31);border:1px solid var(--dsw-alias-border-l2,#484b52);border-radius:9px;box-shadow:0 18px 50px rgba(0,0,0,.45);overflow:hidden}
.ig-modal-hdr{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237);font-weight:600;font-size:12.5px}
.ig-modal-hdr .ig-spacer{flex:1}
.ig-modal-body{padding:12px;display:flex;flex-direction:column;gap:9px;max-height:65vh;overflow:auto}
.ig-modal-footer{display:flex;align-items:center;justify-content:flex-end;gap:6px;padding:9px 12px;border-top:1px solid var(--dsw-alias-border-l1,#303237);background:var(--dsw-alias-bg-layer-1,#202124)}
.ig-field{display:flex;flex-direction:column;gap:4px}
.ig-field label{font-size:10.5px;text-transform:uppercase;letter-spacing:.04em;color:var(--dsw-alias-label-secondary,#9aa0a6)}
.ig-field .ig-input{height:28px}
.ig-field .ig-input input{font-size:12px}
.ig-modal-text{font-size:12px;line-height:1.55;color:var(--dsw-alias-label-secondary,#9aa0a6);white-space:pre-wrap}
.ig-dialog-danger{color:var(--dsw-alias-state-error-primary,#e05a5a)}
.ig-menu{position:fixed;z-index:1100;min-width:210px;max-width:320px;background:var(--dsw-alias-bg-overlay,#2b2d31);border:1px solid var(--dsw-alias-border-l2,#484b52);border-radius:7px;box-shadow:0 12px 32px rgba(0,0,0,.4);padding:4px;overflow:hidden}
.ig-menu-item{display:flex;align-items:center;gap:7px;width:100%;padding:5px 8px;border:0;border-radius:4px;background:transparent;color:var(--dsw-alias-label-primary,#dedede);text-align:left;font-size:11.5px;white-space:nowrap}
.ig-menu-item:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2,#292a2e)}
.ig-menu-item:disabled{opacity:.45;cursor:default}
.ig-menu-item.ig-danger{color:var(--dsw-alias-state-error-primary,#e05a5a)}
.ig-menu-item .ig-menu-label{flex:1;overflow:hidden;text-overflow:ellipsis}
.ig-menu-item .ig-menu-hint{color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:10px}
.ig-menu-sep{height:1px;background:var(--dsw-alias-border-l1,#303237);margin:4px 2px}
.ig-menu-title{padding:4px 8px;font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:var(--dsw-alias-label-secondary,#9aa0a6)}
.ig-popover{position:fixed;z-index:1050;width:330px;max-height:440px;display:flex;flex-direction:column;background:var(--dsw-alias-bg-overlay,#2b2d31);border:1px solid var(--dsw-alias-border-l2,#484b52);border-radius:8px;box-shadow:0 14px 36px rgba(0,0,0,.42);overflow:hidden}
.ig-popover-hdr{padding:7px;border-bottom:1px solid var(--dsw-alias-border-l1,#303237);flex:none}
.ig-popover-scroll{flex:1;overflow:auto;min-height:0;padding:3px}
.ig-popover-row{display:flex;align-items:center;gap:7px;width:100%;padding:5px 7px;border:0;border-radius:4px;background:transparent;text-align:left;font-size:11.5px;color:var(--dsw-alias-label-primary,#dedede)}
.ig-popover-row:hover{background:var(--dsw-alias-bg-layer-2,#292a2e)}
.ig-popover-row .ig-spacer{flex:1}
.ig-popover-empty{padding:14px;text-align:center;color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:11px}
.ig-toasts{position:fixed;right:16px;bottom:16px;z-index:1300;display:flex;flex-direction:column;gap:7px;width:340px;max-width:calc(100vw - 32px)}
.ig-toast{display:flex;align-items:flex-start;gap:8px;padding:9px 10px;border:1px solid var(--dsw-alias-border-l2,#484b52);border-radius:7px;background:var(--dsw-alias-bg-overlay,#2b2d31);box-shadow:0 10px 28px rgba(0,0,0,.35);font-size:11.5px;line-height:1.5;animation:ig-toast-in .18s ease-out}
@keyframes ig-toast-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.ig-toast .ig-toast-icon{flex:none;margin-top:1px}
.ig-toast.ig-success .ig-toast-icon{color:var(--dsw-alias-state-success-primary,#4cb782)}
.ig-toast.ig-error .ig-toast-icon{color:var(--dsw-alias-state-error-primary,#e05a5a)}
.ig-toast.ig-warn .ig-toast-icon{color:var(--dsw-alias-state-warn-primary,#d8a23a)}
.ig-toast .ig-toast-text{flex:1;min-width:0;word-break:break-word;white-space:pre-wrap}
.ig-toast .ig-toast-close{border:0;background:transparent;color:var(--dsw-alias-label-secondary,#9aa0a6);padding:0;display:flex}
.ig-key{display:inline-flex;align-items:center;padding:0 4px;height:16px;border:1px solid var(--dsw-alias-border-l1,#303237);border-radius:3px;font-size:9.5px;color:var(--dsw-alias-label-secondary,#9aa0a6);background:var(--dsw-alias-bg-base,#17181b)}
.ig-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.ig-error-box{display:flex;align-items:flex-start;gap:8px;padding:9px 10px;border:1px solid color-mix(in srgb,var(--dsw-alias-state-error-primary,#e05a5a) 35%,transparent);border-radius:6px;background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#e05a5a) 9%,transparent);color:var(--dsw-alias-state-error-primary,#e05a5a);font-size:11.5px;line-height:1.5;white-space:pre-wrap;word-break:break-word}
.ig-warn-box{display:flex;align-items:flex-start;gap:8px;padding:8px 9px;border:1px solid color-mix(in srgb,var(--dsw-alias-state-warn-primary,#d8a23a) 32%,transparent);border-radius:6px;background:color-mix(in srgb,var(--dsw-alias-state-warn-primary,#d8a23a) 9%,transparent);color:var(--dsw-alias-state-warn-primary,#d8a23a);font-size:11px;line-height:1.5}
.ig-hint{font-size:10px;color:var(--dsw-alias-label-secondary,#9aa0a6);line-height:1.5}
.ig-divider{height:1px;background:var(--dsw-alias-border-l1,#303237);margin:4px 0}
@media (max-width:1100px){
  .ig-repo-path{display:none}
  .ig-row,.ig-thead{grid-template-columns:var(--ig-cols,120px minmax(150px,1fr) 100px 78px 0)}
  .ig-date{display:none}
  .ig-thead > span.ig-date-h{display:none}
}
@media (max-width:880px){
  .ig-row,.ig-thead{grid-template-columns:var(--ig-cols,100px minmax(120px,1fr) 78px 0 0)}
  .ig-author,.ig-thead > span.ig-author-h{display:none}
  .ig-branch-chip{max-width:170px}
  .ig-refs{width:180px;min-width:150px}
  .ig-details{width:320px;min-width:250px}
  .ig-changes-list{width:320px}
}
.ig-compare-list{display:flex;flex-direction:column;gap:1px;max-height:56vh;overflow:auto;border-top:1px solid var(--dsw-alias-border-l1,#303237);border-bottom:1px solid var(--dsw-alias-border-l1,#303237);padding:4px 0}
.ig-compare-row{display:flex;align-items:center;gap:7px;width:100%;padding:4px 7px;border:0;border-radius:4px;background:transparent;color:var(--dsw-alias-label-primary,#dedede);text-align:left;font-size:11.5px;min-height:24px}
.ig-compare-row:hover{background:var(--dsw-alias-bg-layer-2,#292a2e)}
.ig-rebase-list{display:flex;flex-direction:column;gap:2px;max-height:46vh;overflow:auto;border-top:1px solid var(--dsw-alias-border-l1,#303237);border-bottom:1px solid var(--dsw-alias-border-l1,#303237);padding:4px 0}
.ig-rebase-row{display:flex;align-items:center;gap:6px;padding:3px 5px;border-radius:4px;min-height:29px}
.ig-rebase-row:hover{background:var(--dsw-alias-bg-layer-2,#292a2e)}
.ig-rebase-order{width:20px;height:20px;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;background:var(--dsw-alias-bg-layer-2,#292a2e);color:var(--dsw-alias-label-secondary,#9aa0a6);font-size:10px;flex:none}
.ig-rebase-subject{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11.5px}
.ig-rebase-row .ig-select{height:24px;font-size:10.5px;flex:none}
.ig-select{height:28px;border:1px solid var(--dsw-alias-border-l1,#303237);border-radius:5px;background:var(--dsw-alias-bg-base,#17181b);color:var(--dsw-alias-label-primary,#dedede);padding:0 7px;font-size:12px;outline:none}
.ig-select:focus{border-color:var(--dsw-alias-brand-primary,#4c8dff)}
@media (max-width:1180px){.ig-action-label{display:none}}
.ig-compact .ig-details{position:absolute;right:0;top:0;bottom:0;z-index:25;box-shadow:-14px 0 34px rgba(0,0,0,.4)}
.ig-compact .ig-splitter{display:none}
.ig-compact .ig-changes-list{width:300px}
.ig-compact .ig-author,.ig-compact .ig-thead > .ig-author-h,.ig-compact .ig-date,.ig-compact .ig-thead > .ig-date-h{display:none}
@media (max-width:980px){.ig-title{display:none}.ig-repo{max-width:220px}.ig-branch-chip{max-width:180px}}
@media (max-width:720px){.ig-logo{display:none}.ig-repo-path{display:none}.ig-hdr{gap:5px;padding:6px 8px}.ig-refs{width:158px;min-width:140px}.ig-changes-list{width:250px;min-width:220px}}
`

    /* ------------------------------------------------------------------ *
     * Hooks
     * ------------------------------------------------------------------ */
    function useElementWidth(ref) {
      const [width, setWidth] = React.useState(0)
      React.useEffect(() => {
        const element = ref.current
        if (!element) return undefined
        const update = () => setWidth(element.getBoundingClientRect().width)
        update()
        if (typeof ResizeObserver === 'function') {
          const observer = new ResizeObserver(update)
          observer.observe(element)
          return () => observer.disconnect()
        }
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
      }, [ref])
      return width
    }

    function useVirtualRows(scrollRef, count, rowHeight, overscan = 8) {
      const [range, setRange] = React.useState({ start: 0, end: Math.min(count, 60) })
      const recalc = React.useCallback(() => {
        const element = scrollRef.current
        if (!element) {
          const end = Math.min(count, 60)
          setRange((previous) => (previous.start === 0 && previous.end === end ? previous : { start: 0, end }))
          return
        }
        const start = Math.max(0, Math.floor(element.scrollTop / rowHeight) - overscan)
        const end = Math.min(count, Math.ceil((element.scrollTop + element.clientHeight) / rowHeight) + overscan)
        setRange((previous) => (previous.start === start && previous.end === end ? previous : { start, end }))
      }, [count, overscan, rowHeight, scrollRef])
      React.useEffect(() => {
        recalc()
        const element = scrollRef.current
        if (!element) return undefined
        element.addEventListener('scroll', recalc, { passive: true })
        let observer
        if (typeof ResizeObserver === 'function') {
          observer = new ResizeObserver(recalc)
          observer.observe(element)
        }
        return () => {
          element.removeEventListener('scroll', recalc)
          if (observer) observer.disconnect()
        }
      }, [recalc, scrollRef])
      return { ...range, totalHeight: count * rowHeight }
    }

    function useDebounced(value, delay) {
      const [debounced, setDebounced] = React.useState(value)
      React.useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
      }, [value, delay])
      return debounced
    }

    /* ------------------------------------------------------------------ *
     * Primitives
     * ------------------------------------------------------------------ */
    function IconButton({ icon, label, onClick, disabled, active, busy, size = 16, className, title }) {
      return h('button', {
        type: 'button',
        className: cx('ig-iconbtn', active && 'ig-on', className),
        onClick,
        disabled,
        title: title || label,
        'aria-label': label,
        'aria-pressed': active ? 'true' : undefined,
      }, busy ? h('span', { className: 'ig-spinner', style: { width: size - 2, height: size - 2 } }) : h(Icon, { name: icon, size }))
    }

    function Button({ children, icon, onClick, disabled, variant, small, busy, type = 'button', title }) {
      return h('button', {
        type,
        className: cx('ig-btn', variant && `ig-${variant}`, small && 'ig-small'),
        onClick,
        disabled: disabled || busy,
        title,
      }, busy ? h('span', { className: 'ig-spinner' }) : icon ? h(Icon, { name: icon, size: 14 }) : null, children)
    }

    function Spinner({ label }) {
      return h('span', { className: 'ig-spinner', 'aria-label': label || 'Loading' })
    }

    function RefBadges({ decorations, refs, max = 4 }) {
      const parsed = parseDecorations(decorations, refs)
      if (!parsed.length) return null
      const shown = parsed.slice(0, max)
      const rest = parsed.length - shown.length
      return h('span', { className: 'ig-badges' },
        shown.map((entry, index) => h('span', {
          key: `${entry.kind}-${entry.name}-${index}`,
          className: cx('ig-badge', `ig-${entry.kind}`),
          title: `${entry.kind}: ${entry.name}`,
        }, entry.kind === 'head' ? h(Icon, { name: 'commit', size: 10 }) : null, entry.name)),
        rest > 0 ? h('span', { className: 'ig-badge ig-remote', title: parsed.slice(max).map((entry) => entry.name).join(', ') }, `+${rest}`) : null)
    }

    function Avatar({ name, size = 18 }) {
      const color = hashColor(name)
      return h('span', {
        className: 'ig-avatar',
        style: { width: size, height: size, background: color, fontSize: Math.max(7, size * 0.44) },
        title: name || '',
        'aria-hidden': true,
      }, initials(name))
    }

    function EmptyState({ icon = 'git', title, text, action }) {
      return h('div', { className: 'ig-empty' },
        h('div', { className: 'ig-empty-icon' }, h(Icon, { name: icon, size: 20 })),
        title ? h('div', { className: 'ig-empty-title' }, title) : null,
        text ? h('div', { className: 'ig-empty-text' }, text) : null,
        action || null)
    }

    function SkeletonLines({ count = 3 }) {
      return h('div', { style: { padding: '10px 12px' } },
        Array.from({ length: count }, (_, index) => h('div', {
          key: index,
          className: 'ig-skeleton',
          style: { width: `${90 - index * 14}%` },
        })))
    }

    function Modal({ open, title, icon, onClose, children, footer, width }) {
      React.useEffect(() => {
        if (!open) return undefined
        const onKey = (event) => {
          if (event.key === 'Escape') {
            event.stopPropagation()
            onClose()
          }
        }
        window.addEventListener('keydown', onKey, true)
        return () => window.removeEventListener('keydown', onKey, true)
      }, [open, onClose])
      if (!open) return null
      return h('div', {
        className: 'ig-overlay',
        onMouseDown: (event) => {
          if (event.target === event.currentTarget) onClose()
        },
      }, h('div', {
        className: 'ig-modal',
        style: width ? { width } : undefined,
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': title,
      },
      h('div', { className: 'ig-modal-hdr' },
        icon ? h(Icon, { name: icon, size: 15 }) : null,
        h('span', null, title),
        h('span', { className: 'ig-spacer' }),
        h(IconButton, { icon: 'close', label: 'Close', onClick: onClose })),
      h('div', { className: 'ig-modal-body' }, children),
      footer ? h('div', { className: 'ig-modal-footer' }, footer) : null))
    }

    function Menu({ menu, onClose }) {
      React.useEffect(() => {
        if (!menu) return undefined
        const onKey = (event) => {
          if (event.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKey, true)
        return () => window.removeEventListener('keydown', onKey, true)
      }, [menu, onClose])
      if (!menu) return null
      const items = (menu.items || []).filter(Boolean)
      const estimated = items.reduce((sum, item) => sum + (item.type === 'separator' ? 9 : item.type === 'title' ? 22 : 29), 0) + 12
      const left = clamp(menu.x ?? 0, 8, Math.max(8, window.innerWidth - 330))
      const top = clamp(menu.y ?? 0, 8, Math.max(8, window.innerHeight - estimated - 8))
      return h(React.Fragment, null,
        h('div', {
          style: { position: 'fixed', inset: 0, zIndex: 1099 },
          onMouseDown: onClose,
          onContextMenu: (event) => {
            event.preventDefault()
            onClose()
          },
        }),
        h('div', { className: 'ig-menu', style: { left, top }, role: 'menu' },
          items.map((item, index) => {
            if (item.type === 'separator') return h('div', { key: index, className: 'ig-menu-sep' })
            if (item.type === 'title') return h('div', { key: index, className: 'ig-menu-title' }, item.label)
            return h('button', {
              key: index,
              type: 'button',
              role: 'menuitem',
              className: cx('ig-menu-item', item.danger && 'ig-danger'),
              disabled: item.disabled,
              onClick: () => {
                onClose()
                if (item.onClick) item.onClick()
              },
            },
            item.icon ? h(Icon, { name: item.icon, size: 14 }) : null,
            h('span', { className: 'ig-menu-label' }, item.label),
            item.hint ? h('span', { className: 'ig-menu-hint' }, item.hint) : null)
          })))
    }

    function Popover({ popover, onClose, children, width }) {
      React.useEffect(() => {
        if (!popover) return undefined
        const onKey = (event) => {
          if (event.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKey, true)
        return () => window.removeEventListener('keydown', onKey, true)
      }, [popover, onClose])
      if (!popover) return null
      const rect = popover.anchor || { left: 20, top: 60, right: 220, bottom: 80, width: 200 }
      const popWidth = width || 330
      let left = rect.left
      if (left + popWidth > window.innerWidth - 10) left = Math.max(10, window.innerWidth - popWidth - 10)
      let top = rect.bottom + 4
      if (top + 360 > window.innerHeight) top = Math.max(10, rect.top - 364)
      return h(React.Fragment, null,
        h('div', {
          style: { position: 'fixed', inset: 0, zIndex: 1040 },
          onMouseDown: onClose,
          onContextMenu: (event) => {
            event.preventDefault()
            onClose()
          },
        }),
        h('div', { className: 'ig-popover', style: { left, top, width: popWidth } }, children))
    }

    function Toast({ toast, onDismiss }) {
      React.useEffect(() => {
        const timer = setTimeout(() => onDismiss(toast.id), toast.duration || 4400)
        return () => clearTimeout(timer)
      }, [toast.id, toast.duration, onDismiss])
      const icon = toast.tone === 'error' ? 'error' : toast.tone === 'warn' ? 'warning' : 'check'
      return h('div', { className: cx('ig-toast', `ig-${toast.tone || 'success'}`), role: 'status' },
        h('span', { className: 'ig-toast-icon' }, h(Icon, { name: icon, size: 15 })),
        h('span', { className: 'ig-toast-text' }, toast.text),
        h('button', { type: 'button', className: 'ig-toast-close', onClick: () => onDismiss(toast.id), 'aria-label': 'Close' }, h(Icon, { name: 'close', size: 13 })))
    }

    function ErrorBox({ error, onRetry }) {
      const t = useT()
      if (!error) return null
      return h('div', { className: 'ig-error-box' },
        h(Icon, { name: 'error', size: 15 }),
        h('div', { style: { flex: 1, minWidth: 0 } },
          h('div', { style: { fontWeight: 600, marginBottom: 2 } }, error.code === 'auth' ? t('Authentication failed') : t('Git error')),
          h('div', null, error.message || String(error))),
        onRetry ? h(Button, { small: true, onClick: onRetry }, t('Try again')) : null)
    }

    function Toggle({ checked, onChange, label, icon }) {
      return h('button', {
        type: 'button',
        className: cx('ig-toggle', checked && 'ig-on'),
        onClick: () => onChange(!checked),
        'aria-pressed': checked ? 'true' : 'false',
        title: label,
      }, icon ? h(Icon, { name: icon, size: 13 }) : null, label)
    }

    /* ------------------------------------------------------------------ *
     * Graph layout
     * ------------------------------------------------------------------ */
    const LANE_PALETTE = ['#5b8def', '#98c379', '#e5a04c', '#c678dd', '#56b6c2', '#e06c75', '#7f9cf5', '#d19a66']

    function buildGraph(commits) {
      const byHash = new Map()
      commits.forEach((commit, index) => byHash.set(commit.hash, index))
      const rows = new Array(commits.length)
      const active = new Map()
      const laneColor = []
      const laneUsed = []
      let maxLane = 0
      const edges = []
      const pickColor = (avoid) => {
        for (const color of LANE_PALETTE) {
          if (!avoid.includes(color)) return color
        }
        return LANE_PALETTE[avoid.length % LANE_PALETTE.length]
      }
      const allocLane = (avoid) => {
        let lane = 0
        while (laneUsed[lane]) lane += 1
        laneUsed[lane] = true
        maxLane = Math.max(maxLane, lane)
        laneColor[lane] = pickColor(avoid)
        return lane
      }
      for (let index = 0; index < commits.length; index += 1) {
        const commit = commits[index]
        const incoming = active.get(commit.hash) || []
        active.delete(commit.hash)
        let nodeLane
        if (incoming.length) {
          nodeLane = Math.min(...incoming.map((edge) => edge.toLane))
        } else {
          nodeLane = allocLane([])
        }
        if (!laneColor[nodeLane]) laneColor[nodeLane] = pickColor([])
        const nodeColor = laneColor[nodeLane]
        for (const edge of incoming) {
          edge.parentRow = index
          edge.toNodeLane = nodeLane
        }
        const outgoing = []
        const parents = commit.parents || []
        parents.forEach((parent, parentIndex) => {
          const existing = active.get(parent)
          if (existing && existing.length) {
            const edge = {
              childRow: index,
              parentHash: parent,
              fromLane: nodeLane,
              toLane: existing[0].toLane,
              color: existing[0].color,
              join: true,
            }
            existing.push(edge)
            edges.push(edge)
            outgoing.push(edge)
            return
          }
          let lane
          if (parentIndex === 0) {
            lane = nodeLane
          } else {
            lane = allocLane([nodeColor])
          }
          if (!laneColor[lane]) laneColor[lane] = pickColor([nodeColor])
          const color = parentIndex === 0 ? nodeColor : laneColor[lane]
          laneColor[lane] = color
          const edge = {
            childRow: index,
            parentHash: parent,
            fromLane: nodeLane,
            toLane: lane,
            color,
            join: false,
          }
          active.set(parent, [edge])
          edges.push(edge)
          outgoing.push(edge)
        })
        for (const [parent, list] of [...active.entries()]) {
          if (!byHash.has(parent)) {
            for (const edge of list) edge.dangling = true
            active.delete(parent)
          }
        }
        const used = new Set()
        for (const list of active.values()) {
          for (const edge of list) used.add(edge.toLane)
        }
        for (let lane = 0; lane < laneUsed.length; lane += 1) {
          if (laneUsed[lane] && !used.has(lane) && lane !== nodeLane) {
            laneUsed[lane] = false
            laneColor[lane] = null
          }
        }
        if (!parents.length && !used.has(nodeLane)) {
          laneUsed[nodeLane] = false
          laneColor[nodeLane] = null
        }
        rows[index] = { index, commit, nodeLane, nodeColor, incoming, outgoing, passing: [] }
      }
      for (const edge of edges) {
        const parentRow = byHash.get(edge.parentHash)
        edge.parentRow = parentRow === undefined ? null : parentRow
      }
      for (let index = 0; index < rows.length; index += 1) {
        const passing = new Map()
        for (const edge of edges) {
          if (edge.parentRow === null) continue
          if (edge.childRow < index && index < edge.parentRow) {
            if (!passing.has(edge.toLane)) passing.set(edge.toLane, { lane: edge.toLane, color: edge.color })
          }
        }
        rows[index].passing = [...passing.values()]
      }
      return {
        rows,
        maxLane,
        width: GRAPH_PAD * 2 + (maxLane + 1) * LANE_W,
      }
    }

    function GraphCell({ row, width, maxLane, selected, head }) {
      const height = ROW_H
      const middle = height / 2
      const usable = Math.max(24, width - GRAPH_PAD * 2)
      const laneWidth = maxLane > 0 ? Math.max(5, Math.min(LANE_W, usable / (maxLane + 1))) : LANE_W
      const x = (lane) => GRAPH_PAD + lane * laneWidth
      const nodeX = x(row.nodeLane)
      const parts = []
      for (const passing of row.passing) {
        if (passing.lane === row.nodeLane) continue
        parts.push(h('line', {
          key: `p-${passing.lane}`,
          x1: x(passing.lane),
          y1: 0,
          x2: x(passing.lane),
          y2: height,
          stroke: passing.color,
          strokeWidth: 1.5,
          opacity: 0.72,
        }))
      }
      for (let index = 0; index < row.incoming.length; index += 1) {
        const edge = row.incoming[index]
        if (edge.toLane === row.nodeLane) {
          parts.push(h('line', {
            key: `in-${index}`,
            x1: nodeX,
            y1: 0,
            x2: nodeX,
            y2: middle,
            stroke: edge.color,
            strokeWidth: 1.5,
            opacity: 0.9,
          }))
        } else {
          parts.push(h('path', {
            key: `in-${index}`,
            d: `M ${x(edge.toLane)} 0 C ${x(edge.toLane)} ${middle * 0.55}, ${nodeX} ${middle * 0.45}, ${nodeX} ${middle}`,
            fill: 'none',
            stroke: edge.color,
            strokeWidth: 1.5,
            opacity: 0.9,
          }))
        }
      }
      for (let index = 0; index < row.outgoing.length; index += 1) {
        const edge = row.outgoing[index]
        const endY = edge.dangling ? height * 0.72 : height
        if (edge.toLane === row.nodeLane) {
          parts.push(h('line', {
            key: `out-${index}`,
            x1: nodeX,
            y1: middle,
            x2: nodeX,
            y2: endY,
            stroke: edge.color,
            strokeWidth: 1.5,
            opacity: edge.dangling ? 0.35 : 0.9,
            strokeDasharray: edge.dangling ? '2 3' : undefined,
          }))
        } else {
          parts.push(h('path', {
            key: `out-${index}`,
            d: `M ${nodeX} ${middle} C ${nodeX} ${endY - (endY - middle) * 0.45}, ${x(edge.toLane)} ${endY - (endY - middle) * 0.55}, ${x(edge.toLane)} ${endY}`,
            fill: 'none',
            stroke: edge.color,
            strokeWidth: 1.5,
            opacity: edge.dangling ? 0.35 : 0.9,
            strokeDasharray: edge.dangling ? '2 3' : undefined,
          }))
        }
      }
      if (selected) {
        parts.push(h('circle', { key: 'sel', cx: nodeX, cy: middle, r: 7, fill: 'none', stroke: 'var(--dsw-alias-brand-primary, #4c8dff)', strokeWidth: 1, opacity: 0.55 }))
      }
      if (head) {
        parts.push(h('circle', { key: 'head', cx: nodeX, cy: middle, r: 6.4, fill: 'none', stroke: row.nodeColor, strokeWidth: 1, opacity: 0.35 }))
      }
      parts.push(h('circle', {
        key: 'node',
        cx: nodeX,
        cy: middle,
        r: row.commit.parents?.length > 1 ? 4.6 : 3.8,
        fill: row.nodeColor,
        stroke: 'var(--dsw-alias-bg-base, #17181b)',
        strokeWidth: 1.4,
      }))
      if (row.commit.parents?.length > 1) {
        parts.push(h('circle', { key: 'merge', cx: nodeX, cy: middle, r: 1.5, fill: 'var(--dsw-alias-bg-base, #17181b)' }))
      }
      return h('svg', {
        width,
        height,
        viewBox: `0 0 ${width} ${height}`,
        className: 'ig-graph',
        'aria-hidden': true,
        focusable: false,
      }, parts)
    }

    /* ------------------------------------------------------------------ *
     * Diff parsing and side-by-side rendering
     * ------------------------------------------------------------------ */
    function parseUnifiedDiff(raw) {
      const text = String(raw || '')
      const lines = text.split(/\r?\n/)
      const result = { hunks: [], binary: /Binary files .* differ|GIT binary patch/.test(text), oldPath: '', newPath: '', raw: text }
      let hunk = null
      let oldLine = 0
      let newLine = 0
      for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index]
        if (line.startsWith('diff --git ')) {
          const match = line.match(/^diff --git a\/(.*) b\/(.*)$/)
          if (match) {
            result.oldPath = match[1]
            result.newPath = match[2]
          }
          continue
        }
        if (line.startsWith('--- ')) {
          const value = line.slice(4)
          if (value !== '/dev/null') result.oldPath = value.replace(/^a\//, '')
          continue
        }
        if (line.startsWith('+++ ')) {
          const value = line.slice(4)
          if (value !== '/dev/null') result.newPath = value.replace(/^b\//, '')
          continue
        }
        const header = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(.*)$/)
        if (header) {
          oldLine = Number.parseInt(header[1], 10)
          newLine = Number.parseInt(header[3], 10)
          hunk = {
            header: line,
            context: header[5].trim(),
            oldStart: oldLine,
            oldCount: header[2] === undefined ? 1 : Number.parseInt(header[2], 10),
            newStart: newLine,
            newCount: header[4] === undefined ? 1 : Number.parseInt(header[4], 10),
            lines: [],
          }
          result.hunks.push(hunk)
          continue
        }
        if (!hunk) continue
        if (line.startsWith('\\')) {
          hunk.lines.push({ kind: 'meta', text: line })
          continue
        }
        if (line.startsWith('+')) {
          hunk.lines.push({ kind: 'add', text: line.slice(1), oldLine: null, newLine })
          newLine += 1
          continue
        }
        if (line.startsWith('-')) {
          hunk.lines.push({ kind: 'del', text: line.slice(1), oldLine, newLine: null })
          oldLine += 1
          continue
        }
        if (line.startsWith(' ')) {
          hunk.lines.push({ kind: 'ctx', text: line.slice(1), oldLine, newLine })
          oldLine += 1
          newLine += 1
          continue
        }
        if (line === '' && index === lines.length - 1) continue
        if (line === '') {
          hunk.lines.push({ kind: 'ctx', text: '', oldLine, newLine })
          oldLine += 1
          newLine += 1
        }
      }
      return result
    }

    function tokenizeLine(text) {
      return String(text).match(/[A-Za-z0-9_]+|\s+|[^\sA-Za-z0-9_]/g) || []
    }

    function wordDiff(left, right) {
      const a = tokenizeLine(left)
      const b = tokenizeLine(right)
      if (a.length > 220 || b.length > 220 || left.length > 500 || right.length > 500) {
        return [
          [{ text: left, changed: false }],
          [{ text: right, changed: false }],
        ]
      }
      const rows = a.length + 1
      const cols = b.length + 1
      const table = Array.from({ length: rows }, () => new Uint16Array(cols))
      for (let i = a.length - 1; i >= 0; i -= 1) {
        for (let j = b.length - 1; j >= 0; j -= 1) {
          table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1])
        }
      }
      const leftChanged = new Array(a.length).fill(true)
      const rightChanged = new Array(b.length).fill(true)
      let i = 0
      let j = 0
      while (i < a.length && j < b.length) {
        if (a[i] === b[j]) {
          leftChanged[i] = false
          rightChanged[j] = false
          i += 1
          j += 1
        } else if (table[i + 1][j] >= table[i][j + 1]) {
          i += 1
        } else {
          j += 1
        }
      }
      const toSegments = (tokens, changed) => {
        const segments = []
        for (let index = 0; index < tokens.length; index += 1) {
          const isChanged = changed[index]
          const last = segments[segments.length - 1]
          if (last && last.changed === isChanged) last.text += tokens[index]
          else segments.push({ text: tokens[index], changed: isChanged })
        }
        return segments.length ? segments : [{ text: '', changed: false }]
      }
      return [toSegments(a, leftChanged), toSegments(b, rightChanged)]
    }

    function buildSplitRows(hunks) {
      const rows = []
      hunks.forEach((hunk, hunkIndex) => {
        rows.push({ type: 'hunk', header: hunk.header, index: hunkIndex })
        let index = 0
        while (index < hunk.lines.length) {
          const line = hunk.lines[index]
          if (line.kind === 'meta') {
            rows.push({ type: 'meta', text: line.text })
            index += 1
            continue
          }
          if (line.kind === 'ctx') {
            rows.push({ type: 'ctx', left: { line: line.oldLine, text: line.text }, right: { line: line.newLine, text: line.text } })
            index += 1
            continue
          }
          if (line.kind === 'del' || line.kind === 'add') {
            const deletions = []
            const additions = []
            while (index < hunk.lines.length && hunk.lines[index].kind === 'del') {
              deletions.push(hunk.lines[index])
              index += 1
            }
            while (index < hunk.lines.length && hunk.lines[index].kind === 'add') {
              additions.push(hunk.lines[index])
              index += 1
            }
            const count = Math.max(deletions.length, additions.length)
            for (let offset = 0; offset < count; offset += 1) {
              const deletion = deletions[offset] || null
              const addition = additions[offset] || null
              let leftSegments = deletion ? [{ text: deletion.text, changed: false }] : []
              let rightSegments = addition ? [{ text: addition.text, changed: false }] : []
              if (deletion && addition) {
                const [leftWords, rightWords] = wordDiff(deletion.text, addition.text)
                leftSegments = leftWords
                rightSegments = rightWords
              }
              rows.push({
                type: deletion && addition ? 'pair' : deletion ? 'del' : 'add',
                left: deletion ? { line: deletion.oldLine, text: deletion.text, segments: leftSegments } : null,
                right: addition ? { line: addition.newLine, text: addition.text, segments: rightSegments } : null,
              })
            }
            continue
          }
          index += 1
        }
      })
      return rows
    }

    function HunkHeader({ header, index, controls }) {
      const t = useT()
      if (!controls) return h('span', { className: 'ig-hunk-label' }, header)
      const checked = controls.selected.has(index)
      return h('label', { className: cx('ig-hunk-check', checked && 'ig-checked'), title: t('Select hunk') },
        h('input', {
          type: 'checkbox',
          checked,
          onChange: () => controls.onToggle(index),
          'aria-label': `${t('Select hunk')} ${index + 1}`,
        }),
        h('span', { className: 'ig-hunk-label' }, header))
    }

    function Segments({ segments, side }) {
      return h(React.Fragment, null, (segments || []).map((segment, index) => segment.changed
        ? h('span', { key: index, className: side === 'left' ? 'ig-word-del' : 'ig-word-add' }, segment.text)
        : h('span', { key: index }, segment.text)))
    }

    /** Clipboard text that points an AI at one region of one file. */
    function locationText(filePath, range, hash) {
      if (!filePath) return ''
      const where = range
        ? (range.start === range.end ? `${filePath}:${range.start}` : `${filePath}:${range.start}-${range.end}`)
        : filePath
      return hash ? `${where} @ ${shortHash(hash)}` : where
    }

    /** Click to pin a line, shift-click to extend a range (new-file numbering). */
    function useLineSelection() {
      const [selection, setSelection] = React.useState(null)
      const onRowClick = React.useCallback((line, shiftKey) => {
        if (line === null || line === undefined) return
        setSelection((previous) => {
          if (shiftKey && previous) return { anchor: previous.anchor, focus: line }
          return { anchor: line, focus: line }
        })
      }, [])
      const clear = React.useCallback(() => setSelection(null), [])
      const range = selection
        ? { start: Math.min(selection.anchor, selection.focus), end: Math.max(selection.anchor, selection.focus) }
        : null
      return { range, onRowClick, clear, active: Boolean(selection) }
    }

    function DiffTable({ parsed, mode, hunkControls, lineSelection }) {
      const rows = React.useMemo(() => buildSplitRows(parsed.hunks), [parsed.hunks])
      const inRange = (line) => {
        if (!lineSelection?.range || line === null || line === undefined) return false
        return line >= lineSelection.range.start && line <= lineSelection.range.end
      }
      const rowProps = (line) => (lineSelection
        ? {
          onClick: (event) => lineSelection.onRowClick(line, event.shiftKey),
          title: lineSelection.range ? `L${lineSelection.range.start}-${lineSelection.range.end}` : undefined,
        }
        : {})
      if (mode === 'split') {
        return h('table', { className: 'ig-diff-split' }, h('tbody', null,
          rows.map((row, index) => {
            if (row.type === 'hunk') {
              return h('tr', { key: index, className: 'ig-hunk-row' }, h('td', { colSpan: 2 }, h(HunkHeader, { header: row.header, index: row.index, controls: hunkControls })))
            }
            if (row.type === 'meta') {
              return h('tr', { key: index, className: 'ig-meta-row' }, h('td', { colSpan: 2 }, row.text))
            }
            const line = row.right?.line ?? row.left?.line ?? null
            return h('tr', {
              key: index,
              className: cx(
                row.type === 'pair' ? 'ig-pair-row' : row.type === 'del' ? 'ig-del-row' : row.type === 'add' ? 'ig-add-row' : '',
                inRange(line) && 'ig-line-selected',
              ),
              ...rowProps(line),
            },
            h('td', { className: 'ig-split-side ig-left' }, h('div', { className: 'ig-split-cell' },
              h('span', { className: 'ig-gutter' }, row.left?.line ?? ''),
              h('span', { className: 'ig-code' }, row.left ? (row.type === 'pair' && row.left.segments ? h(Segments, { segments: row.left.segments, side: 'left' }) : row.left.text) : ''))),
            h('td', { className: 'ig-split-side ig-right' }, h('div', { className: 'ig-split-cell' },
              h('span', { className: 'ig-gutter' }, row.right?.line ?? ''),
              h('span', { className: 'ig-code' }, row.right ? (row.type === 'pair' && row.right.segments ? h(Segments, { segments: row.right.segments, side: 'right' }) : row.right.text) : ''))))
          })))
      }
      return h('table', { className: 'ig-diff-table' }, h('tbody', null,
        parsed.hunks.flatMap((hunk, hunkIndex) => {
          const output = [h('tr', { key: `h-${hunkIndex}`, className: 'ig-hunk-row' }, h('td', { colSpan: 4 }, h(HunkHeader, { header: hunk.header, index: hunkIndex, controls: hunkControls })))]
          for (let index = 0; index < hunk.lines.length; index += 1) {
            const line = hunk.lines[index]
            if (line.kind === 'meta') {
              output.push(h('tr', { key: `m-${hunkIndex}-${index}`, className: 'ig-meta-row' }, h('td', { colSpan: 4 }, line.text)))
              continue
            }
            const lineNo = line.newLine ?? line.oldLine ?? null
            output.push(h('tr', {
              key: `l-${hunkIndex}-${index}`,
              className: cx(line.kind === 'add' ? 'ig-add-row' : line.kind === 'del' ? 'ig-del-row' : '', inRange(lineNo) && 'ig-line-selected'),
              ...rowProps(lineNo),
            },
            h('td', { className: 'ig-gutter' }, line.oldLine ?? ''),
            h('td', { className: 'ig-gutter' }, line.newLine ?? ''),
            h('td', { className: 'ig-sign' }, line.kind === 'add' ? '+' : line.kind === 'del' ? '-' : ''),
            h('td', { className: 'ig-code' }, line.text)))
          }
          return output
        })))
    }

    /* ------------------------------------------------------------------ *
     * Workbench context
     * ------------------------------------------------------------------ */
    const WorkbenchContext = React.createContext(null)
    function useWb() {
      return React.useContext(WorkbenchContext)
    }

    /* ------------------------------------------------------------------ *
     * Reference sidebar
     * ------------------------------------------------------------------ */
    function RefsSidebar() {
      const wb = useWb()
      const t = useT()
      const [query, setQuery] = React.useState('')
      const [collapsed, setCollapsed] = React.useState({})
      const refs = wb.refs || { local: [], remote: [], tags: [] }
      const matches = (entry) => !query.trim() || entry.name.toLowerCase().includes(query.trim().toLowerCase())
      const toggleGroup = (key) => setCollapsed((previous) => ({ ...previous, [key]: !previous[key] }))
      const activeRefs = wb.filters.refs || []
      const isActive = (name) => !wb.filters.all && activeRefs.includes(name)
      const selectRef = (name, event) => {
        const additive = event && (event.metaKey || event.ctrlKey)
        if (additive) {
          const next = activeRefs.includes(name) ? activeRefs.filter((entry) => entry !== name) : [...activeRefs, name]
          wb.setFilters({ ...wb.filters, all: next.length === 0, refs: next })
        } else if (isActive(name) && activeRefs.length === 1) {
          wb.setFilters({ ...wb.filters, all: true, refs: [] })
        } else {
          wb.setFilters({ ...wb.filters, all: false, refs: [name] })
        }
      }
      const group = (key, label, entries, icon) => {
        const visible = entries.filter(matches)
        if (!visible.length && query.trim()) return null
        const isCollapsed = collapsed[key]
        const rows = !isCollapsed ? visible.map((entry) => {
          return h('div', {
            key: entry.name,
            className: cx('ig-ref-row', isActive(entry.name) && 'ig-active'),
            role: 'button',
            tabIndex: 0,
            title: `${entry.name}\n${entry.subject || ''}`,
            onClick: (event) => selectRef(entry.name, event),
            onDoubleClick: () => wb.checkoutRef(entry.name),
            onContextMenu: (event) => wb.openRefMenu(event, entry),
            onKeyDown: (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                selectRef(entry.name, event)
              }
            },
          },
          h('span', { className: 'ig-ref-icon' }, h(Icon, { name: icon, size: 13 })),
          h('span', { className: 'ig-ref-row-main' },
            h('span', { className: 'ig-ref-row-name' }, entry.name),
            h('span', { className: 'ig-ref-row-meta' },
              entry.head ? h(Icon, { name: 'commit', size: 9 }) : null,
              entry.upstream && entry.upstream !== entry.name ? h('span', { className: 'ig-ellipsis', style: { maxWidth: 95 } }, entry.upstream) : null,
              entry.ahead ? h('span', { style: { color: 'var(--dsw-alias-state-success-primary,#4cb782)' } }, `↑${entry.ahead}`) : null,
              entry.behind ? h('span', { style: { color: 'var(--dsw-alias-state-warn-primary,#d8a23a)' } }, `↓${entry.behind}`) : null,
              entry.gone ? h('span', { style: { color: 'var(--dsw-alias-state-warn-primary,#d8a23a)' } }, t('gone')) : null)),
          h('span', { className: 'ig-ref-row-actions' },
            h(IconButton, {
              icon: 'arrowRight',
              label: t('Checkout'),
              size: 13,
              onClick: (event) => {
                event.stopPropagation()
                wb.checkoutRef(entry.name)
              },
            }),
            h(IconButton, {
              icon: 'more',
              label: t('More'),
              size: 13,
              onClick: (event) => {
                event.stopPropagation()
                wb.openRefMenu(event, entry)
              },
            })))
        }) : null
        return h('div', { className: 'ig-ref-group', key },
          h('button', {
            type: 'button',
            className: 'ig-ref-group-hdr',
            onClick: () => toggleGroup(key),
            'aria-expanded': !isCollapsed,
          },
          h(Icon, { name: isCollapsed ? 'chevronRight' : 'chevronDown', size: 11 }),
          h('span', null, label),
          h('span', { className: 'ig-count' }, visible.length)),
          rows)
      }
      return h('aside', { className: 'ig-refs' },
        h('div', { className: 'ig-refs-top' },
          h('div', { className: 'ig-input' },
            h(Icon, { name: 'search', size: 13 }),
            h('input', {
              value: query,
              placeholder: t('Search branches'),
              onChange: (event) => setQuery(event.target.value),
              'aria-label': t('Search branches'),
            }),
            query ? h('button', { type: 'button', className: 'ig-input-clear', onClick: () => setQuery(''), 'aria-label': t('Clear search') }, h(Icon, { name: 'close', size: 12 })) : null)),
        h('button', {
          type: 'button',
          className: cx('ig-ref-all', wb.filters.all && 'ig-active'),
          onClick: () => wb.setFilters({ ...wb.filters, all: true, refs: [] }),
        },
        h(Icon, { name: 'git', size: 13 }),
        h('span', { style: { flex: 1 } }, t('All branches')),
        h('span', { className: 'ig-count' }, refs.all?.length || 0)),
        h('div', { className: 'ig-refs-scroll' },
          group('local', t('Local'), refs.local || [], 'branch'),
          group('remote', t('Remote'), refs.remote || [], 'external'),
          group('tags', t('Tags'), refs.tags || [], 'tag'),
          query && !(refs.all || []).some(matches) ? h('div', { className: 'ig-popover-empty' }, t('No matching branches')) : null))
    }

    /* ------------------------------------------------------------------ *
     * Commit details + file tree
     * ------------------------------------------------------------------ */
    function buildFileTree(files) {
      const root = { name: '', path: '', dirs: new Map(), files: [] }
      for (const file of files) {
        const parts = String(file.path || '').split('/').filter(Boolean)
        if (!parts.length) continue
        let node = root
        for (let index = 0; index < parts.length - 1; index += 1) {
          const part = parts[index]
          if (!node.dirs.has(part)) {
            node.dirs.set(part, { name: part, path: `${node.path ? `${node.path}/` : ''}${part}`, dirs: new Map(), files: [] })
          }
          node = node.dirs.get(part)
        }
        node.files.push(file)
      }
      const count = (node) => {
        let total = node.files.length
        for (const child of node.dirs.values()) total += count(child)
        node.count = total
        return total
      }
      count(root)
      return root
    }

    function FileTreeNode({ node, depth, collapsed, toggle, activePath, openFile, fileMenu }) {
      const t = useT()
      const dirs = [...node.dirs.values()].sort((a, b) => a.name.localeCompare(b.name))
      const files = [...node.files].sort((a, b) => a.path.localeCompare(b.path))
      return h(React.Fragment, null,
        dirs.map((dir) => {
          const isCollapsed = collapsed.has(dir.path)
          return h(React.Fragment, { key: `d-${dir.path}` },
            h('button', {
              type: 'button',
              className: 'ig-file-dir',
              style: { paddingLeft: 8 + depth * 12 },
              onClick: () => toggle(dir.path),
              'aria-expanded': !isCollapsed,
            },
            h(Icon, { name: isCollapsed ? 'chevronRight' : 'chevronDown', size: 10 }),
            h(Icon, { name: 'folder', size: 12, style: { color: 'var(--dsw-alias-label-secondary,#9aa0a6)' } }),
            h('span', { className: 'ig-ellipsis', style: { flex: 1 } }, dir.name),
            h('span', { className: 'ig-dim', style: { fontSize: 9.5 } }, dir.count)),
            !isCollapsed ? h(FileTreeNode, {
              node: dir,
              depth: depth + 1,
              collapsed,
              toggle,
              activePath,
              openFile,
              fileMenu,
            }) : null)
        }),
        files.map((file) => {
          const meta = statusMeta(file.status)
          return h('button', {
            key: `f-${file.path}`,
            type: 'button',
            className: cx('ig-file-row', activePath === file.path && 'ig-active'),
            style: { paddingLeft: 8 + depth * 12 + 14 },
            onClick: () => openFile(file),
            onDoubleClick: () => openFile(file),
            onContextMenu: (event) => fileMenu(event, file),
            title: `${file.path}\n${meta.label}`,
          },
          h('span', { className: cx('ig-status-chip', `ig-${meta.tone}`), title: meta.label }, String(file.status || '?').slice(0, 1)),
          h('span', { className: 'ig-file-name' }, file.name || basename(file.path)),
          h('span', { className: 'ig-file-dirname' }, dirname(file.path)),
          file.binary
            ? h('span', { className: 'ig-dim', style: { fontSize: 9.5 } }, 'bin')
            : h('span', { style: { display: 'flex', gap: 4, fontSize: 9.5, flex: 'none' } },
              file.additions ? h('span', { className: 'ig-add' }, `+${file.additions}`) : null,
              file.deletions ? h('span', { className: 'ig-del' }, `-${file.deletions}`) : null))
        }))
    }

    const TRAILER_TONES = {
      'assisted-by': 'ai',
      'generated-by': 'ai',
      'co-authored-by': 'info',
      'signed-off-by': 'ok',
      'reviewed-by': 'ok',
      'tested-by': 'ok',
      'acked-by': 'ok',
    }

    /** Commit trailers: who (or which AI) contributed to this change. */
    function TrailerChips({ trailers }) {
      const wb = useWb()
      const t = useT()
      if (!trailers?.length) return null
      return h('div', { className: 'ig-trailers' },
        h('div', { className: 'ig-trailers-label' }, t('Trailers')),
        h('div', { className: 'ig-trailer-list' },
          trailers.map((trailer, index) => {
            const tone = TRAILER_TONES[trailer.key.toLowerCase()] || 'plain'
            const text = `${trailer.key}: ${trailer.value}`
            return h('span', {
              key: `${trailer.key}-${index}`,
              className: cx('ig-trailer-chip', `ig-trailer-${tone}`),
              title: text,
            },
            h('span', { className: 'ig-trailer-key' }, trailer.key),
            h('span', { className: 'ig-trailer-value' }, trailer.value),
            h('button', {
              type: 'button',
              className: 'ig-trailer-copy',
              title: t('Copy'),
              onClick: () => wb.copyText(text, trailer.key),
              'aria-label': t('Copy'),
            }, h(Icon, { name: 'copy', size: 10 })))
          })))
    }

    function CommitDetails() {
      const wb = useWb()
      const t = useT()
      const [collapsed, setCollapsed] = React.useState(() => new Set())
      const detail = wb.detail
      const loading = wb.detailLoading
      const error = wb.detailError
      const files = detail?.files || []
      const tree = React.useMemo(() => buildFileTree(files), [files])
      const toggle = (path) => setCollapsed((previous) => {
        const next = new Set(previous)
        if (next.has(path)) next.delete(path)
        else next.add(path)
        return next
      })
      const openFile = React.useCallback((file) => {
        if (!detail?.commit) return
        wb.openDiff({
          kind: 'commit',
          hash: detail.commit.hash,
          file: file.path,
          oldPath: file.oldPath,
          status: file.status,
          additions: file.additions,
          deletions: file.deletions,
          binary: file.binary,
        })
      }, [detail, wb])
      const fileMenu = (event, file) => {
        event.preventDefault()
        event.stopPropagation()
        wb.setMenu({
          x: event.clientX,
          y: event.clientY,
          items: [
            { label: t('Open diff'), icon: 'diff', onClick: () => openFile(file) },
            { label: t('History for this file'), icon: 'clock', onClick: () => wb.openHistoryFor(file.path) },
            { label: t('Blame this file'), icon: 'user', onClick: () => wb.openBlameFor(file.path, detail?.commit?.hash) },
            { type: 'separator' },
            { label: t('Copy path'), icon: 'copy', onClick: () => wb.copyText(file.path, file.path) },
            { label: t('Copy location'), icon: 'pin', onClick: () => {
              const text = locationText(file.path, null, detail?.commit?.hash)
              wb.copyText(text, text)
            } },
            detail?.commit?.hash ? { label: t('Open on remote'), icon: 'external', disabled: !wb.repo?.remoteUrl, onClick: () => wb.openRemote(detail.commit.hash, file.path) } : null,
          ].filter(Boolean),
        })
      }
      const commit = detail?.commit
      const filesLabel = `${formatNumber(detail?.totalFiles ?? files.length)} ${t('files')}`
      const openFirst = () => {
        if (files[0]) openFile(files[0])
      }
      return h('section', { className: 'ig-details', style: { width: wb.detailsWidth } },
        h('div', { className: 'ig-details-hdr' },
          h(Icon, { name: 'commit', size: 13, style: { color: 'var(--dsw-alias-brand-primary,#4c8dff)' } }),
          h('span', { className: 'ig-details-title' }, t('Commit details')),
          h(IconButton, { icon: 'close', label: t('Hide details'), size: 14, onClick: wb.toggleDetails })),
        h('div', { className: 'ig-details-body' },
          loading ? h(SkeletonLines, { count: 5 }) : error ? h('div', { style: { padding: 10 } }, h(ErrorBox, { error, onRetry: () => wb.selectCommit(wb.selectedHash) })) : !commit ? h(EmptyState, { icon: 'commit', title: t('Select a commit to see details.') }) : h(React.Fragment, null,
            h('div', { className: 'ig-commit-info' },
              h('h3', { className: 'ig-commit-subject' }, commit.subject || t('No commits')),
              h('div', { className: 'ig-commit-meta' },
                h('div', { className: 'ig-meta-row' },
                  h('span', { className: 'ig-meta-label' }, t('Hash')),
                  h('span', { className: 'ig-hash-chip' },
                    h('span', null, commit.hash.slice(0, 12)),
                    h('button', { type: 'button', title: t('Copy hash'), onClick: () => wb.copyText(commit.hash, commit.hash), 'aria-label': t('Copy hash') }, h(Icon, { name: 'copy', size: 10 })))),
                h('div', { className: 'ig-meta-row' },
                  h('span', { className: 'ig-meta-label' }, t('Author')),
                  h(Avatar, { name: commit.authorName, size: 16 }),
                  h('span', { className: 'ig-meta-value' }, `${commit.authorName} <${commit.authorEmail}>`),
                  h('span', { className: 'ig-dim', style: { fontSize: 10, flex: 'none' }, title: formatAbsolute(commit.authorTime) }, relativeTime(commit.authorTime, t))),
                commit.committerName && commit.committerName !== commit.authorName ? h('div', { className: 'ig-meta-row' },
                  h('span', { className: 'ig-meta-label' }, t('Committer')),
                  h('span', { className: 'ig-meta-value' }, commit.committerName)) : null,
                h('div', { className: 'ig-meta-row' },
                  h('span', { className: 'ig-meta-label' }, t('Date')),
                  h('span', { className: 'ig-meta-value' }, formatAbsolute(commit.authorTime))),
                commit.parents?.length ? h('div', { className: 'ig-meta-row' },
                  h('span', { className: 'ig-meta-label' }, commit.parents.length > 1 ? t('parents') : t('parent')),
                  h('span', { style: { display: 'flex', gap: 4, flexWrap: 'wrap', minWidth: 0 } },
                    commit.parents.map((parent) => h('button', {
                      key: parent,
                      type: 'button',
                      className: 'ig-hash-chip',
                      style: { cursor: 'pointer' },
                      onClick: () => wb.selectCommit(parent),
                      title: parent,
                    }, parent.slice(0, 8))))) : null),
              h('div', { className: 'ig-ref-badges' }, h(RefBadges, { decorations: commit.decorations, refs: wb.refs, max: 8 })),
              h('div', { style: { display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' } },
                h(Button, { small: true, icon: 'diff', onClick: openFirst, disabled: !files.length }, t('Open diff')),
                h(Button, { small: true, icon: 'git', onClick: (event) => wb.openCommitMenu(event, commit) }, t('More')))),
            commit.body?.trim() ? h('div', { className: 'ig-commit-message' }, commit.body.trim()) : null,
            h(TrailerChips, { trailers: commit.trailers }),
            h('div', { className: 'ig-commit-stats' },
              h(Icon, { name: 'file', size: 12 }),
              h('span', null, `${filesLabel} ${t('changed')}`),
              h('span', { className: 'ig-add' }, `+${formatNumber(detail.totalAdditions)}`),
              h('span', { className: 'ig-del' }, `-${formatNumber(detail.totalDeletions)}`),
              detail.filesTruncated ? h('span', { className: 'ig-warn' }, t('Diff truncated')) : null),
            h('div', { className: 'ig-file-tree' },
              files.length ? h(FileTreeNode, {
                node: tree,
                depth: 0,
                collapsed,
                toggle,
                activePath: wb.diffTarget?.file,
                openFile,
                fileMenu,
              }) : h('div', { style: { padding: '10px 12px' }, className: 'ig-dim' }, t('No file changes'))))))
    }

    /* ------------------------------------------------------------------ *
     * Commit row and log tab
     * ------------------------------------------------------------------ */
    function CommitRow({ row, graph, graphWidth, index }) {
      const wb = useWb()
      const t = useT()
      const commit = row.commit
      const selected = wb.selectedHash === commit.hash
      const isHead = wb.status?.head === commit.hash || wb.repo?.head === commit.hash
      return h('div', {
        className: cx('ig-row', selected && 'ig-selected'),
        role: 'row',
        'aria-selected': selected ? 'true' : 'false',
        onClick: () => wb.selectCommit(commit.hash),
        onDoubleClick: () => {
          wb.selectCommit(commit.hash)
          if (wb.detail?.commit?.hash === commit.hash && wb.detail?.files?.[0]) {
            const file = wb.detail.files[0]
            wb.openDiff({ kind: 'commit', hash: commit.hash, file: file.path, oldPath: file.oldPath, status: file.status, additions: file.additions, deletions: file.deletions, binary: file.binary })
          }
        },
        onContextMenu: (event) => wb.openCommitMenu(event, commit),
        title: `${commit.hash}\n${commit.subject}`,
      },
      h('div', { className: 'ig-graph' },
        h(GraphCell, {
          row,
          width: graphWidth,
          maxLane: graph.maxLane,
          selected,
          head: isHead,
        })),
      h('div', { className: 'ig-subject' },
        h('span', { className: 'ig-subject-text' }, commit.subject || '(no subject)'),
        h(RefBadges, { decorations: commit.decorations, refs: wb.refs, max: 3 })),
      h('div', { className: 'ig-author' },
        h(Avatar, { name: commit.authorName }),
        h('span', null, commit.authorName)),
      h('div', { className: 'ig-date', title: formatAbsolute(commit.authorTime) }, relativeTime(commit.authorTime, t)),
      h('div', { className: 'ig-hash', title: commit.hash }, shortHash(commit.hash)))
    }

    function LogTab() {
      const wb = useWb()
      const t = useT()
      const [filtersOpen, setFiltersOpen] = React.useState(false)
      const scrollRef = React.useRef(null)
      const graph = wb.graph
      const graphWidth = Math.min(200, Math.max(44, graph.width || 44))
      const cols = wb.compact
        ? `${graphWidth}px minmax(120px,1fr) 78px`
        : `${graphWidth}px minmax(150px,1fr) 128px 100px 78px`
      const virtual = useVirtualRows(scrollRef, wb.commits.length, ROW_H)
      React.useEffect(() => {
        const element = scrollRef.current
        if (!element || !wb.selectedHash) return
        const index = wb.commits.findIndex((commit) => commit.hash === wb.selectedHash)
        if (index < 0) return
        const top = index * ROW_H
        const bottom = top + ROW_H
        if (top < element.scrollTop || bottom > element.scrollTop + element.clientHeight) {
          element.scrollTop = Math.max(0, top - element.clientHeight / 2)
        }
      }, [wb.selectedHash, wb.commits])
      const hasFilters = Boolean(wb.filters.search || wb.filters.author || wb.filters.path || wb.filters.since || wb.filters.until || !wb.filters.all || wb.filters.firstParent)
      return h('div', { className: 'ig-log' },
        h(RefsSidebar),
        h('div', { className: 'ig-log-main' },
          h('div', { className: 'ig-log-toolbar' },
            h('div', { className: 'ig-input ig-search' },
              h(Icon, { name: 'search', size: 13 }),
              h('input', {
                value: wb.filters.search,
                placeholder: t('Search commits'),
                onChange: (event) => wb.setFilters({ ...wb.filters, search: event.target.value }),
                'aria-label': t('Search commits'),
              }),
              wb.filters.search ? h('button', { type: 'button', className: 'ig-input-clear', onClick: () => wb.setFilters({ ...wb.filters, search: '' }), 'aria-label': t('Clear search') }, h(Icon, { name: 'close', size: 12 })) : null),
            h(Toggle, {
              checked: wb.filters.firstParent,
              onChange: (value) => wb.setFilters({ ...wb.filters, firstParent: value }),
              label: t('First parent only'),
              icon: 'commit',
            }),
            h(IconButton, {
              icon: 'filter',
              label: t('Filters'),
              active: filtersOpen || hasFilters,
              onClick: () => setFiltersOpen((value) => !value),
            }),
            wb.logLoading ? h(Spinner) : null,
            h('span', { className: 'ig-dim', style: { fontSize: 10 } }, `${formatNumber(wb.commits.length)} ${t('commits')}`),
            h('span', { style: { flex: 1 } }),
            h(IconButton, { icon: 'refresh', label: t('Refresh log'), onClick: wb.refreshAll, busy: wb.refreshing }),
            h(IconButton, {
              icon: wb.showDetails ? 'split' : 'unified',
              label: wb.showDetails ? t('Hide details') : t('Show details'),
              active: wb.showDetails,
              onClick: wb.toggleDetails,
            })),
          filtersOpen ? h('div', { className: 'ig-filter-row' },
            h('div', { className: 'ig-input' },
              h(Icon, { name: 'user', size: 12 }),
              h('input', {
                value: wb.filters.author,
                placeholder: t('Author'),
                onChange: (event) => wb.setFilters({ ...wb.filters, author: event.target.value }),
                'aria-label': t('Author'),
              })),
            h('div', { className: 'ig-input ig-wide' },
              h(Icon, { name: 'file', size: 12 }),
              h('input', {
                value: wb.filters.path,
                placeholder: t('Path'),
                onChange: (event) => wb.setFilters({ ...wb.filters, path: event.target.value }),
                'aria-label': t('Path'),
              })),
            h('div', { className: 'ig-input' },
              h(Icon, { name: 'calendar', size: 12 }),
              h('input', {
                value: wb.filters.since,
                placeholder: t('Since'),
                onChange: (event) => wb.setFilters({ ...wb.filters, since: event.target.value }),
                'aria-label': t('Since'),
              })),
            h('div', { className: 'ig-input' },
              h(Icon, { name: 'calendar', size: 12 }),
              h('input', {
                value: wb.filters.until,
                placeholder: t('Until'),
                onChange: (event) => wb.setFilters({ ...wb.filters, until: event.target.value }),
                'aria-label': t('Until'),
              })),
            hasFilters ? h(Button, {
              small: true,
              variant: 'ghost',
              icon: 'close',
              onClick: () => wb.setFilters({ search: '', author: '', path: '', since: '', until: '', all: true, refs: [], firstParent: false }),
            }, t('Clear filters')) : null) : null,
          wb.logError ? h('div', { style: { padding: 8 } }, h(ErrorBox, { error: wb.logError, onRetry: () => wb.loadLog(false) })) : null,
          h('div', { className: 'ig-table', style: { '--ig-cols': cols } },
            h('div', { className: 'ig-thead' },
              h('span', null, ''),
              h('span', null, t('Subject')),
              h('span', { className: 'ig-author-h' }, t('Author')),
              h('span', { className: 'ig-date-h' }, t('Date')),
              h('span', null, t('Hash'))),
            wb.commits.length === 0 && !wb.logLoading
              ? h(EmptyState, {
                icon: hasFilters ? 'search' : 'git',
                title: hasFilters ? t('No commits match these filters') : t('No commits'),
                text: hasFilters ? null : t('Create the first commit to see a graph.'),
              })
              : h('div', {
                className: 'ig-scroll',
                ref: scrollRef,
                role: 'grid',
                tabIndex: 0,
                onKeyDown: (event) => {
                  if (!wb.commits.length) return
                  const index = wb.commits.findIndex((commit) => commit.hash === wb.selectedHash)
                  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                    event.preventDefault()
                    const next = clamp(index + (event.key === 'ArrowDown' ? 1 : -1), 0, wb.commits.length - 1)
                    wb.selectCommit(wb.commits[next].hash)
                  } else if (event.key === 'Enter' && wb.selectedHash) {
                    event.preventDefault()
                    if (wb.detail?.files?.[0]) {
                      const file = wb.detail.files[0]
                      wb.openDiff({ kind: 'commit', hash: wb.selectedHash, file: file.path, oldPath: file.oldPath, status: file.status, additions: file.additions, deletions: file.deletions, binary: file.binary })
                    }
                  }
                },
              },
              h('div', { style: { height: virtual.totalHeight, position: 'relative' } },
                h('div', { style: { transform: `translateY(${virtual.start * ROW_H}px)` } },
                  wb.commits.slice(virtual.start, virtual.end).map((commit, offset) => {
                    const row = graph.rows[virtual.start + offset]
                    if (!row) return null
                    return h(CommitRow, {
                      key: commit.hash,
                      row,
                      graph,
                      graphWidth,
                      index: virtual.start + offset,
                    })
                  })))),
            wb.hasMore ? h('div', { className: 'ig-loadmore' },
              h(Button, { small: true, variant: 'ghost', onClick: () => wb.loadLog(true), busy: wb.logLoadingMore }, t('Load more'))) : null)),
        wb.showDetails ? h(React.Fragment, null,
          h(Splitter),
          h(CommitDetails)) : null)
    }

    function Splitter() {
      const wb = useWb()
      const onPointerDown = (event) => {
        event.preventDefault()
        const startX = event.clientX
        const startWidth = wb.detailsWidth
        const move = (moveEvent) => {
          wb.setDetailsWidth(clamp(startWidth + (startX - moveEvent.clientX), 280, 560))
        }
        const up = () => {
          window.removeEventListener('pointermove', move)
          window.removeEventListener('pointerup', up)
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
      }
      return h('div', {
        className: 'ig-splitter',
        role: 'separator',
        'aria-orientation': 'vertical',
        title: 'Resize',
        onPointerDown,
      })
    }

    /* ------------------------------------------------------------------ *
     * Diff surfaces
     * ------------------------------------------------------------------ */
    /**
     * Hunk-level staging controls for the working-tree and index diffs.
     * Returns null for every other diff kind (commits, ranges, stashes,
     * untracked files) because those are not selectively stageable.
     */
    function useHunkControls(target) {
      const wb = useWb()
      const [selected, setSelected] = React.useState(() => new Set())
      const raw = wb.diffData?.raw || ''
      const total = React.useMemo(() => (raw ? raw.split('\n').filter((line) => line.startsWith('@@ ')).length : 0), [raw])
      const signature = `${target?.kind || ''}:${target?.file || ''}:${raw.length}`
      React.useEffect(() => {
        setSelected(new Set())
      }, [signature])
      const enabled = Boolean(target && ['worktree', 'staged'].includes(target.kind) && total > 0)
      if (!enabled) return null
      const mode = target.kind === 'staged' ? 'unstage' : 'stage'
      const toggle = (index) => setSelected((previous) => {
        const next = new Set(previous)
        if (next.has(index)) next.delete(index)
        else next.add(index)
        return next
      })
      const apply = () => {
        if (!selected.size) return
        wb.stageHunks(target.file, mode, [...selected])
      }
      return { selected, onToggle: toggle, mode, count: selected.size, total, apply, busy: wb.busy === 'stageHunks' }
    }

    function DiffContent({ data, error, loading, mode, emptyText, hunkControls, lineSelection }) {
      const t = useT()
      const raw = data?.raw || ''
      const parsed = React.useMemo(() => parseUnifiedDiff(raw), [raw])
      if (loading) return h(SkeletonLines, { count: 8 })
      if (error) return h('div', { style: { padding: 10 } }, h(ErrorBox, { error }))
      if (!data) return h(EmptyState, { icon: 'diff', title: emptyText || t('No diff available') })
      if (data.binary) return h(EmptyState, { icon: 'file', title: t('Binary file differs'), text: data.file || '' })
      if (data.tooLarge) return h(EmptyState, { icon: 'file', title: t('File is too large to display') })
      if (!parsed.hunks.length) {
        return h(EmptyState, {
          icon: 'diff',
          title: parsed.binary ? t('Binary file differs') : t('No textual changes'),
          text: data.raw?.trim() ? data.raw.trim().slice(0, 400) : null,
        })
      }
      return h(React.Fragment, null,
        h('div', { style: { minHeight: 0 } }, h(DiffTable, { parsed, mode, hunkControls, lineSelection })),
        data.truncated ? h('div', { className: 'ig-warn-box', style: { margin: 8 } }, t('Diff truncated')) : null)
    }

    function targetTitle(wb, target, t) {
      if (!target) return ''
      if (target.kind === 'stash') {
        const stash = (wb.stashes || []).find((entry) => entry.index === target.index)
        return `stash@{${target.index}}${stash ? ` · ${stash.subject}` : ''}`
      }
      if (target.kind === 'worktree') return `${target.file} · ${t('Working tree')}`
      if (target.kind === 'staged') return `${target.file} · ${t('Index')}`
      if (target.kind === 'untracked') return `${target.file} · ${t('Untracked')}`
      if (target.kind === 'commit') return `${target.file} · ${shortHash(target.hash)}`
      if (target.kind === 'range') return `${target.file} · ${shortHash(target.base)}..${shortHash(target.target)}`
      return target.file || ''
    }

    function HunkToolbar({ controls }) {
      const t = useT()
      if (!controls) return null
      const label = controls.mode === 'unstage' ? t('Unstage selected hunks') : t('Stage selected hunks')
      return h('button', {
        type: 'button',
        className: cx('ig-btn', 'ig-small', controls.count ? '' : 'ig-ghost'),
        onClick: controls.apply,
        disabled: !controls.count || controls.busy,
        title: label,
      },
      controls.busy ? h('span', { className: 'ig-spinner' }) : h(Icon, { name: controls.mode === 'unstage' ? 'minus' : 'plus', size: 12 }),
      h('span', null, label),
      h('span', { className: 'ig-hint' }, `${controls.count}/${controls.total}`))
    }

    /** "Copy location" button plus the current line-range chip. */
    function LocationToolbar({ filePath, range, hash, onCopy }) {
      const t = useT()
      if (!filePath) return null
      const label = t('Copy location')
      return h(React.Fragment, null,
        range ? h('span', { className: 'ig-loc-chip', title: label }, `L${range.start}${range.end > range.start ? `-${range.end}` : ''}`) : null,
        h('button', {
          type: 'button',
          className: 'ig-btn ig-small',
          onClick: onCopy,
          title: label,
          'aria-label': label,
        },
        h(Icon, { name: 'pin', size: 12 }),
        h('span', null, label)))
    }

    function DiffOverlay() {
      const wb = useWb()
      const t = useT()
      const hunkControls = useHunkControls(wb.diffTarget)
      const lineSelection = useLineSelection()
      if (!wb.diffOpen || !wb.diffTarget) return null
      const target = wb.diffTarget
      const detailFiles = wb.detail?.files || []
      const fileIndex = target.kind === 'commit' ? detailFiles.findIndex((file) => file.path === target.file) : -1
      const goRelative = (delta) => {
        if (fileIndex < 0) return
        const next = detailFiles[fileIndex + delta]
        if (!next) return
        wb.openDiff({ kind: 'commit', hash: target.hash, file: next.path, oldPath: next.oldPath, status: next.status, additions: next.additions, deletions: next.deletions, binary: next.binary })
      }
      const meta = statusMeta(target.status)
      const filePath = target.file
      const contextLabel = target.kind === 'commit'
        ? shortHash(target.hash)
        : target.kind === 'range'
          ? `${shortHash(target.base)}..${shortHash(target.target)}`
          : targetTitle(wb, target, t).replace(target.file || '', '').replace(/^ · /, '')
      const headerTools = [
        h('span', { className: 'ig-seg', key: 'mode' },
          h('button', { type: 'button', className: cx(wb.diffMode === 'split' && 'ig-active'), onClick: () => wb.setDiffMode('split'), title: t('Split') }, h(Icon, { name: 'split', size: 12 }), t('Split')),
          h('button', { type: 'button', className: cx(wb.diffMode === 'unified' && 'ig-active'), onClick: () => wb.setDiffMode('unified'), title: t('Unified') }, h(Icon, { name: 'unified', size: 12 }), t('Unified'))),
        h(Toggle, { key: 'ws', checked: wb.ignoreWs, onChange: wb.setIgnoreWs, label: t('Ignore whitespace'), icon: 'filter' }),
        h(Toggle, {
          key: 'fine',
          checked: wb.diffContext === 0,
          onChange: (value) => wb.setDiffContext(value ? 0 : 3),
          label: t('Fine-grained hunks'),
          icon: 'split',
          title: t('Fine-grained hunks'),
        }),
      ]
      if (target.kind === 'commit' && detailFiles.length > 1) {
        headerTools.push(h(IconButton, { key: 'prev', icon: 'chevronLeft', label: t('Previous file'), onClick: () => goRelative(-1), disabled: fileIndex <= 0 }))
        headerTools.push(h(IconButton, { key: 'next', icon: 'chevronRight', label: t('Next file'), onClick: () => goRelative(1), disabled: fileIndex < 0 || fileIndex >= detailFiles.length - 1 }))
      }
      if (filePath) {
        headerTools.push(h(IconButton, { key: 'copy', icon: 'copy', label: t('Copy path'), onClick: () => wb.copyText(filePath, filePath) }))
        headerTools.push(h(IconButton, { key: 'history', icon: 'clock', label: t('File history'), onClick: () => wb.openHistoryFor(filePath) }))
        headerTools.push(h(IconButton, {
          key: 'blame',
          icon: 'user',
          label: t('Blame'),
          onClick: () => wb.openBlameFor(filePath, target.kind === 'commit' ? target.hash : target.kind === 'range' ? target.target : 'HEAD'),
        }))
      }
      if (target.kind === 'commit' && wb.repo?.remoteUrl) {
        headerTools.push(h(IconButton, { key: 'remote', icon: 'external', label: t('Open on remote'), onClick: () => wb.openRemote(target.hash, filePath) }))
      }
      headerTools.push(h(HunkToolbar, { key: 'hunks', controls: hunkControls }))
      if (filePath) {
        headerTools.push(h(LocationToolbar, {
          key: 'location',
          filePath,
          range: lineSelection.range,
          hash: target.kind === 'commit' || target.kind === 'range' ? target.hash || target.target : null,
          onCopy: () => {
            const text = locationText(filePath, lineSelection.range, target.kind === 'commit' || target.kind === 'range' ? target.hash || target.target : null)
            wb.copyText(text, text)
          },
        }))
      }
      const header = h('div', { className: 'ig-diff-hdr' },
        h(IconButton, { icon: 'arrowLeft', label: t('Close'), onClick: wb.closeDiff }),
        h('span', { className: 'ig-diff-title' },
          target.status
            ? h('span', { className: cx('ig-status-chip', `ig-${meta.tone}`) }, target.status)
            : h(Icon, { name: target.kind === 'stash' ? 'stash' : 'diff', size: 14 }),
          h('span', { className: 'ig-diff-file' }, target.kind === 'stash' ? `stash@{${target.index}}` : target.file),
          h('span', { className: 'ig-diff-context' }, contextLabel)),
        h('div', { style: { display: 'flex', gap: 4, alignItems: 'center' } }, headerTools))
      const body = h('div', { className: 'ig-diff-body' }, h(DiffContent, {
        data: wb.diffData,
        error: wb.diffError,
        loading: wb.diffLoading,
        mode: wb.diffMode,
        emptyText: t('No diff available'),
        hunkControls,
        lineSelection,
      }))
      return h('div', { className: 'ig-diff-overlay', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('Diff') }, header, body)
    }

    function InlineDiff() {
      const wb = useWb()
      const t = useT()
      const target = wb.diffTarget
      const hunkControls = useHunkControls(target)
      const lineSelection = useLineSelection()
      if (!target || !['worktree', 'staged', 'untracked'].includes(target.kind)) {
        return h(EmptyState, { icon: 'diff', title: t('Select a file to see the diff.') })
      }
      const meta = statusMeta(target.status)
      return h('div', { className: 'ig-inline-diff' },
        h('div', { className: 'ig-inline-diff-hdr' },
          target.status ? h('span', { className: cx('ig-status-chip', `ig-${meta.tone}`) }, target.status) : h(Icon, { name: 'diff', size: 13 }),
          h('span', { className: 'ig-ellipsis', style: { flex: 1, minWidth: 0, fontWeight: 600 } }, target.file),
          h(HunkToolbar, { controls: hunkControls }),
          h(LocationToolbar, {
            filePath: target.file,
            range: lineSelection.range,
            hash: null,
            onCopy: () => wb.copyText(locationText(target.file, lineSelection.range, null), target.file),
          }),
          h('span', { className: 'ig-seg' },
            h('button', { type: 'button', className: cx(wb.diffMode === 'split' && 'ig-active'), onClick: () => wb.setDiffMode('split') }, t('Split')),
            h('button', { type: 'button', className: cx(wb.diffMode === 'unified' && 'ig-active'), onClick: () => wb.setDiffMode('unified') }, t('Unified'))),
          h(Toggle, { checked: wb.ignoreWs, onChange: wb.setIgnoreWs, label: t('Ignore whitespace'), icon: 'filter' }),
          h(Toggle, {
            checked: wb.diffContext === 0,
            onChange: (value) => wb.setDiffContext(value ? 0 : 3),
            label: t('Fine-grained hunks'),
            icon: 'split',
            title: t('Fine-grained hunks'),
          })),
        h('div', { className: 'ig-inline-diff-body' }, h(DiffContent, {
          data: wb.diffData,
          error: wb.diffError,
          loading: wb.diffLoading,
          mode: wb.diffMode,
          emptyText: t('No textual changes'),
          hunkControls,
          lineSelection,
        })))
    }

    /* ------------------------------------------------------------------ *
     * Local changes
     * ------------------------------------------------------------------ */
    function ChangeRow({ change, checked, onCheck, onOpen, onDiscard, onResolve }) {
      const t = useT()
      const wb = useWb()
      const meta = statusMeta(change.status)
      const active = wb.selectedChange && wb.selectedChange.path === change.path && wb.selectedChange.side === change.side
      const conflict = change.side === 'conflict'
      return h('div', {
        className: cx('ig-change-row', active && 'ig-active'),
        onClick: () => onOpen(change),
        title: change.path,
      },
      conflict
        ? h('span', { className: 'ig-change-check', style: { borderColor: 'var(--dsw-alias-state-error-primary,#e05a5a)', color: 'var(--dsw-alias-state-error-primary,#e05a5a)' }, title: t('Conflict') }, h(Icon, { name: 'warning', size: 10 }))
        : h('button', {
          type: 'button',
          className: cx('ig-change-check', checked && 'ig-checked'),
          onClick: (event) => {
            event.stopPropagation()
            onCheck(change)
          },
          title: checked ? t('Unstage') : t('Stage'),
          'aria-label': checked ? t('Unstage') : t('Stage'),
        }, h(Icon, { name: 'check', size: 10 })),
      h('span', { className: cx('ig-status-chip', `ig-${meta.tone}`), title: meta.label }, String(change.status || '?').slice(0, 1)),
      h('span', { className: 'ig-change-name' }, basename(change.path)),
      h('span', { className: 'ig-change-dir' }, dirname(change.path)),
      h('span', { className: 'ig-change-actions' },
        conflict ? h(React.Fragment, null,
          h('button', { type: 'button', className: 'ig-btn ig-ghost ig-small', onClick: (event) => { event.stopPropagation(); onResolve(change, 'ours') }, title: t('Accept ours') }, t('Ours')),
          h('button', { type: 'button', className: 'ig-btn ig-ghost ig-small', onClick: (event) => { event.stopPropagation(); onResolve(change, 'theirs') }, title: t('Accept theirs') }, t('Theirs'))) : null,
        h(IconButton, {
          icon: 'diff',
          label: t('View diff'),
          size: 13,
          onClick: (event) => {
            event.stopPropagation()
            onOpen(change)
          },
        }),
        h(IconButton, {
          icon: 'undo',
          label: t('Discard…'),
          size: 13,
          onClick: (event) => {
            event.stopPropagation()
            onDiscard(change)
          },
        })))
    }

    function LocalChanges() {
      const wb = useWb()
      const t = useT()
      const status = wb.status
      if (!status) return h(EmptyState, { icon: 'git', title: t('Loading…') })
      const groups = [
        { key: 'staged', label: t('Staged'), entries: status.staged || [], checked: true },
        { key: 'unstaged', label: t('Unstaged'), entries: status.unstaged || [], checked: false },
        { key: 'conflicted', label: t('Conflicts'), entries: status.conflicted || [], checked: false },
        { key: 'untracked', label: t('Untracked'), entries: status.untracked || [], checked: false },
      ]
      const total = groups.reduce((sum, group) => sum + group.entries.length, 0)
      const openChange = (change) => {
        const kind = change.side === 'staged' ? 'staged' : change.side === 'untracked' ? 'untracked' : 'worktree'
        wb.openChangeDiff(change)
        wb.setDiffTarget({ kind, file: change.path, oldPath: change.oldPath, status: change.status, untracked: change.side === 'untracked' })
      }
      const checkChange = (change) => {
        if (change.side === 'staged') wb.unstagePaths([change.path])
        else wb.stagePaths([change.path])
      }
      const canCommit = Boolean(status.staged?.length || status.conflicted?.length || wb.amend)
      return h('div', { className: 'ig-changes' },
        h('div', { className: 'ig-changes-list' },
          h('div', { className: 'ig-changes-hdr' },
            h(Icon, { name: 'git', size: 13 }),
            h('span', { style: { fontWeight: 600 } }, t('Local Changes')),
            h('span', { className: 'ig-badge ig-local' }, String(total)),
            h('span', { style: { flex: 1 } }),
            h(IconButton, { icon: 'refresh', label: t('Refresh'), onClick: wb.refreshStatus, busy: wb.refreshingStatus })),
          h('div', { className: 'ig-changes-scroll' },
            total === 0 ? h(EmptyState, { icon: 'check', title: t('Working tree clean'), text: t('Local changes are shown here.') }) : groups.map((group) => group.entries.length ? h('div', { className: 'ig-change-group', key: group.key },
              h('div', { className: 'ig-change-group-hdr' },
                h('span', null, group.label),
                h('span', { className: 'ig-count' }, String(group.entries.length)),
                h('span', { className: 'ig-spacer' }),
                group.key === 'staged' ? h('button', { type: 'button', className: 'ig-iconbtn', style: { height: 19, fontSize: 10 }, onClick: wb.unstageAll }, t('Unstage all'))
                  : group.key !== 'conflicted' ? h('button', { type: 'button', className: 'ig-iconbtn', style: { height: 19, fontSize: 10 }, onClick: wb.stagePathsAll }, t('Stage all')) : null),
              group.entries.map((change) => h(ChangeRow, {
                key: `${group.key}:${change.path}`,
                change,
                checked: group.checked,
                onCheck: checkChange,
                onOpen: openChange,
                onDiscard: (entry) => wb.confirmDiscard(entry),
                onResolve: (entry, side) => wb.resolveConflict(entry.path, side),
              }))) : null))),
        h('div', { className: 'ig-changes-main' },
          h('div', { className: 'ig-commit-card' },
            h('div', { className: 'ig-commit-card-row' },
              h(Icon, { name: 'branch', size: 13, style: { color: 'var(--dsw-alias-brand-primary,#4c8dff)' } }),
              h('span', { style: { fontSize: 11 } }, t('Commit to')),
              h('span', { style: { fontWeight: 600 } }, status.branch || t('Detached HEAD')),
              status.upstream ? h('span', { className: 'ig-dim', style: { fontSize: 10 } }, status.upstream) : null,
              h('span', { className: 'ig-spacer' }),
              h('span', { className: 'ig-dim', style: { fontSize: 10 } }, `${status.staged?.length || 0} ${t('staged')} · ${status.unstaged?.length || 0} ${t('unstaged')}`)),
            !wb.repo?.userName || !wb.repo?.userEmail ? h('div', { className: 'ig-warn-box', style: { marginBottom: 6 } },
              h(Icon, { name: 'warning', size: 13 }),
              h('span', null, t('Set your Git identity before committing.'))) : null,
            h('textarea', {
              className: 'ig-textarea',
              value: wb.commitMessage,
              placeholder: t('Describe your changes'),
              onChange: (event) => wb.setCommitMessage(event.target.value),
              onKeyDown: (event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                  event.preventDefault()
                  wb.commitChanges(false)
                }
              },
              'aria-label': t('Commit message'),
            }),
            h('div', { className: 'ig-commit-card-row', style: { marginTop: 6, marginBottom: 0, gap: 10 } },
              h('label', { className: 'ig-check' },
                h('input', { type: 'checkbox', checked: wb.amend, onChange: (event) => wb.setAmend(event.target.checked) }),
                t('Amend')),
              h('label', { className: 'ig-check' },
                h('input', { type: 'checkbox', checked: wb.signoff, onChange: (event) => wb.setSignoff(event.target.checked) }),
                t('Sign-off')),
              wb.amend ? h('span', { className: 'ig-hint' }, t('Leave the message empty to keep the previous one when amending.')) : null,
              wb.boot?.attribution ? h('span', {
                className: 'ig-hint',
                title: (wb.boot.attribution.values || [wb.boot.attribution.value]).filter(Boolean).map((value) => `${wb.boot.attribution.key}: ${value}`).join('\n'),
              }, t('This panel stamps commits with an Assisted-by trailer.')) : null),
            h('div', { className: 'ig-commit-actions' },
              h(Button, { variant: 'primary', icon: 'check', onClick: () => wb.commitChanges(false), disabled: !canCommit, busy: wb.busy === 'commit' }, t('Commit')),
              status.upstream ? h(Button, { icon: 'push', onClick: () => wb.commitChanges(true), disabled: !canCommit, busy: wb.busy === 'commit-push' }, t('Commit & Push')) : null,
              h(Button, { variant: 'ghost', small: true, onClick: wb.stagePathsAll }, t('Stage all')),
              h(Button, { variant: 'ghost', small: true, icon: 'stash', onClick: () => wb.setStashDialog({ open: true }), disabled: total === 0 }, t('Stash changes')))),
          h(InlineDiff)))
    }

    /* ------------------------------------------------------------------ *
     * File picker, history and blame
     * ------------------------------------------------------------------ */
    function buildPickerTree(files) {
      const root = { name: '', path: '', dirs: new Map(), files: [] }
      for (const file of files) {
        const parts = String(file).split('/').filter(Boolean)
        if (!parts.length) continue
        let node = root
        for (let index = 0; index < parts.length - 1; index += 1) {
          const part = parts[index]
          if (!node.dirs.has(part)) {
            node.dirs.set(part, { name: part, path: `${node.path ? `${node.path}/` : ''}${part}`, dirs: new Map(), files: [] })
          }
          node = node.dirs.get(part)
        }
        node.files.push({ path: file, name: parts[parts.length - 1] })
      }
      return root
    }

    function flattenPicker(node, depth, collapsed, output) {
      const dirs = [...node.dirs.values()].sort((a, b) => a.name.localeCompare(b.name))
      for (const dir of dirs) {
        output.push({ type: 'dir', path: dir.path, name: dir.name, depth })
        if (!collapsed.has(dir.path)) flattenPicker(dir, depth + 1, collapsed, output)
      }
      const files = [...node.files].sort((a, b) => a.name.localeCompare(b.name))
      for (const file of files) output.push({ type: 'file', path: file.path, name: file.name, depth })
      return output
    }

    function FilePicker({ selected, onSelect, title }) {
      const wb = useWb()
      const t = useT()
      const [query, setQuery] = React.useState('')
      const [collapsed, setCollapsed] = React.useState(() => new Set())
      const scrollRef = React.useRef(null)
      const files = wb.filesData?.tracked || []
      const rows = React.useMemo(() => {
        if (!files.length) return []
        if (query.trim()) {
          const lower = query.trim().toLowerCase()
          return files.filter((file) => file.toLowerCase().includes(lower)).slice(0, 3000).map((file) => ({ type: 'file', path: file, name: basename(file), depth: 0 }))
        }
        return flattenPicker(buildPickerTree(files), 0, collapsed, [])
      }, [files, query, collapsed])
      const virtual = useVirtualRows(scrollRef, rows.length, 23)
      const toggle = (path) => setCollapsed((previous) => {
        const next = new Set(previous)
        if (next.has(path)) next.delete(path)
        else next.add(path)
        return next
      })
      return h('div', { className: 'ig-file-picker' },
        h('div', { className: 'ig-picker-hdr' },
          h('div', { className: 'ig-input' },
            h(Icon, { name: 'search', size: 12 }),
            h('input', {
              value: query,
              placeholder: t('Filter files'),
              onChange: (event) => setQuery(event.target.value),
              'aria-label': t('Filter files'),
            }),
            query ? h('button', { type: 'button', className: 'ig-input-clear', onClick: () => setQuery(''), 'aria-label': t('Clear search') }, h(Icon, { name: 'close', size: 11 })) : null)),
        h('div', { className: 'ig-picker-count' },
          wb.filesLoading ? t('Loading…') : `${formatNumber(files.length)} ${t('files')}`,
          wb.filesData?.truncated ? ` · ${t('Diff truncated')}` : ''),
        h('div', { className: 'ig-picker-scroll', ref: scrollRef },
          !files.length && wb.filesLoading ? h(SkeletonLines, { count: 6 }) : !rows.length ? h('div', { className: 'ig-popover-empty' }, t('No matching files')) : h('div', { style: { height: virtual.totalHeight, position: 'relative' } },
            h('div', { style: { transform: `translateY(${virtual.start * 23}px)` } },
              rows.slice(virtual.start, virtual.end).map((row) => row.type === 'dir'
                ? h('button', {
                  key: `d-${row.path}`,
                  type: 'button',
                  className: 'ig-picker-row ig-dir',
                  style: { paddingLeft: 6 + row.depth * 12 },
                  onClick: () => toggle(row.path),
                },
                h(Icon, { name: collapsed.has(row.path) ? 'chevronRight' : 'chevronDown', size: 10 }),
                h(Icon, { name: 'folder', size: 11 }),
                h('span', { className: 'ig-picker-name' }, row.name))
                : h('button', {
                  key: `f-${row.path}`,
                  type: 'button',
                  className: cx('ig-picker-row', selected === row.path && 'ig-active'),
                  style: { paddingLeft: 18 + row.depth * 12 },
                  onClick: () => onSelect(row.path),
                  title: row.path,
                },
                h(Icon, { name: 'file', size: 11 }),
                h('span', { className: 'ig-picker-name' }, row.name)))))))
    }

    function FileHistoryTab() {
      const wb = useWb()
      const t = useT()
      const data = wb.historyData
      const commits = data?.commits || []
      return h('div', { className: 'ig-blame' },
        h(FilePicker, { selected: wb.historyFile, onSelect: wb.setHistoryFile }),
        h('div', { className: 'ig-history' },
          h('div', { className: 'ig-history-hdr' },
            h(Icon, { name: 'clock', size: 14 }),
            h('span', { style: { fontWeight: 600 } }, wb.historyFile || t('File history')),
            wb.historyFile ? h('span', { className: 'ig-dim', style: { fontSize: 10 } }, t('Follow renames')) : null,
            h('span', { className: 'ig-spacer' }),
            wb.historyLoading ? h(Spinner) : null,
            h(IconButton, { icon: 'refresh', label: t('Refresh'), onClick: wb.loadHistory })),
          h('div', { className: 'ig-history-body' },
            !wb.historyFile ? h(EmptyState, { icon: 'clock', title: t('Select a file to see its history') })
              : wb.historyError ? h('div', { style: { padding: 10 } }, h(ErrorBox, { error: wb.historyError, onRetry: wb.loadHistory }))
              : wb.historyLoading && !data ? h(SkeletonLines, { count: 7 })
              : !commits.length ? h(EmptyState, { icon: 'clock', title: t('No history for this file') })
              : h('div', { className: 'ig-history-list' },
                h('div', { className: 'ig-thead', style: { display: 'grid', gridTemplateColumns: 'minmax(180px,1fr) 120px 100px 76px' } },
                  h('span', null, t('Subject')), h('span', null, t('Author')), h('span', null, t('Date')), h('span', null, t('Hash'))),
                commits.map((commit) => h('div', {
                  key: commit.hash,
                  className: cx('ig-history-row', wb.selectedHash === commit.hash && 'ig-selected'),
                  onClick: () => wb.selectCommit(commit.hash),
                  onDoubleClick: () => {
                    wb.selectCommit(commit.hash)
                    wb.openDiff({ kind: 'commit', hash: commit.hash, file: wb.historyFile })
                  },
                  title: commit.hash,
                },
                h('span', { className: 'ig-ellipsis' }, commit.subject),
                h('span', { className: 'ig-author' }, h(Avatar, { name: commit.authorName }), h('span', { className: 'ig-ellipsis' }, commit.authorName)),
                h('span', { className: 'ig-date' }, relativeTime(commit.authorTime, t)),
                h('span', { className: 'ig-hash' }, shortHash(commit.hash))))),
            wb.showDetails ? h(React.Fragment, null, h(Splitter), h(CommitDetails)) : null)))
    }

    function BlameTab() {
      const wb = useWb()
      const t = useT()
      const [revInput, setRevInput] = React.useState(wb.blameRev || 'HEAD')
      const scrollRef = React.useRef(null)
      React.useEffect(() => {
        setRevInput(wb.blameRev || 'HEAD')
      }, [wb.blameRev, wb.blameFile])
      const lines = wb.blameData?.lines || []
      const virtual = useVirtualRows(scrollRef, lines.length, 20)
      return h('div', { className: 'ig-blame' },
        h(FilePicker, {
          selected: wb.blameFile,
          onSelect: (file) => {
            wb.setBlameFile(file)
            wb.setBlameRev('HEAD')
          },
        }),
        h('div', { className: 'ig-blame-main' },
          h('div', { className: 'ig-blame-hdr' },
            h(Icon, { name: 'user', size: 14 }),
            h('span', { style: { fontWeight: 600, maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, wb.blameFile || t('Blame')),
            wb.blameFile ? h('span', { className: 'ig-input', style: { width: 140, height: 24 } },
              h(Icon, { name: 'commit', size: 11 }),
              h('input', {
                value: revInput,
                onChange: (event) => setRevInput(event.target.value),
                onKeyDown: (event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    wb.setBlameRev(revInput.trim() || 'HEAD')
                  }
                },
                'aria-label': t('Revision'),
                title: t('Revision'),
              })) : null,
            wb.blameFile ? h(Button, { small: true, onClick: () => wb.setBlameRev(revInput.trim() || 'HEAD') }, t('Annotate')) : null,
            wb.blameFile ? h(Button, {
              small: true,
              variant: 'ghost',
              icon: 'chevronLeft',
              title: t('Annotate previous revision'),
              onClick: () => wb.setBlameRev(`${(wb.blameRev || 'HEAD').trim() || 'HEAD'}^`),
            }, t('Previous revision')) : null,
            h(Toggle, { checked: wb.blameIgnoreWs, onChange: wb.setBlameIgnoreWs, label: t('Ignore whitespace'), icon: 'filter' }),
            h('span', { className: 'ig-spacer' }),
            wb.blameLoading ? h(Spinner) : null,
            h(IconButton, { icon: 'refresh', label: t('Refresh'), onClick: () => wb.loadBlame() })),
          h('div', { className: 'ig-blame-scroll', ref: scrollRef },
            !wb.blameFile ? h(EmptyState, { icon: 'user', title: t('Select a file to annotate') })
              : wb.blameError ? h('div', { style: { padding: 10 } }, h(ErrorBox, { error: wb.blameError, onRetry: () => wb.loadBlame() }))
              : wb.blameLoading && !wb.blameData ? h(SkeletonLines, { count: 9 })
              : !lines.length ? h(EmptyState, { icon: 'user', title: t('No blame data') })
              : h('div', { style: { height: virtual.totalHeight, position: 'relative' } },
                h('div', { style: { transform: `translateY(${virtual.start * 20}px)` } },
                  lines.slice(virtual.start, virtual.end).map((line, offset) => {
                    const index = virtual.start + offset
                    const previous = index > 0 ? lines[index - 1] : null
                    const first = !previous || previous.hash !== line.hash
                    const color = hashColor(line.email || line.author)
                    return h('div', {
                      key: `${line.hash}-${line.finalLine}`,
                      className: cx('ig-blame-row', first && 'ig-blame-first', wb.selectedHash === line.hash && 'ig-selected'),
                      onClick: () => wb.selectCommit(line.hash),
                      title: `${shortHash(line.hash)} · ${line.author} · ${formatAbsolute(line.time)}\n${line.summary || ''}`,
                    },
                    h('span', { className: 'ig-blame-bar', style: { background: first ? color : 'transparent', opacity: first ? 0.9 : 0 } }),
                    h('span', { className: 'ig-blame-hash' }, first ? shortHash(line.hash) : ''),
                    h('span', { className: 'ig-blame-author', style: { color: first ? color : 'transparent' } }, first ? line.author || t('Unknown author') : '·'),
                    h('span', { className: 'ig-blame-date' }, first ? formatDay(line.time) : ''),
                    h('span', { className: 'ig-blame-line' }, String(line.finalLine)),
                    h('span', { className: 'ig-blame-code' }, line.content),
                    h('button', {
                      type: 'button',
                      className: 'ig-btn ig-ghost ig-small ig-blame-copy',
                      title: t('Copy location'),
                      'aria-label': t('Copy location'),
                      onClick: (event) => {
                        event.stopPropagation()
                        const text = locationText(wb.blameFile, { start: line.finalLine, end: line.finalLine }, line.hash)
                        wb.copyText(text, text)
                      },
                    }, h(Icon, { name: 'pin', size: 11 })))
                  }))))),
        wb.showDetails ? h(React.Fragment, null, h(Splitter), h(CommitDetails)) : null)
    }

    /* ------------------------------------------------------------------ *
     * Stash and console
     * ------------------------------------------------------------------ */
    function StashTab() {
      const wb = useWb()
      const t = useT()
      const stashes = wb.stashes || []
      return h('div', { className: 'ig-stash' },
        h('div', { className: 'ig-stash-hdr' },
          h(Icon, { name: 'stash', size: 14 }),
          h('span', { style: { fontWeight: 600 } }, t('Stash')),
          h('span', { className: 'ig-badge ig-local' }, String(stashes.length)),
          h('span', { className: 'ig-spacer' }),
          h(Button, { small: true, icon: 'plus', onClick: () => wb.setStashDialog({ open: true }) }, t('Stash changes')),
          h(IconButton, { icon: 'refresh', label: t('Refresh'), onClick: wb.loadStashes, busy: wb.stashesLoading })),
        h('div', { className: 'ig-stash-list' },
          !stashes.length ? h(EmptyState, { icon: 'stash', title: t('Stash is empty'), text: t('Stash all local changes') }) : stashes.map((stash) => h('div', {
            key: stash.index,
            className: 'ig-stash-row',
            onClick: () => wb.openDiff({ kind: 'stash', index: stash.index, label: stash.subject }),
          },
          h('span', { className: 'ig-stash-index' }, `stash@{${stash.index}}`),
          h('div', { className: 'ig-stash-main' },
            h('div', { className: 'ig-stash-subject' }, stash.subject),
            h('div', { className: 'ig-stash-meta' }, `${shortHash(stash.hash)} · ${formatAbsolute(stash.time)}`)),
          h('div', { className: 'ig-stash-actions' },
            h(Button, {
              small: true,
              variant: 'ghost',
              onClick: (event) => {
                event.stopPropagation()
                wb.stashAction('stashApply', { index: stash.index }, t('Apply'))
              },
            }, t('Apply')),
            h(Button, {
              small: true,
              variant: 'ghost',
              onClick: (event) => {
                event.stopPropagation()
                wb.stashAction('stashApply', { index: stash.index, pop: true }, t('Pop'))
              },
            }, t('Pop')),
            h(IconButton, {
              icon: 'trash',
              label: t('Drop'),
              size: 13,
              onClick: (event) => {
                event.stopPropagation()
                wb.confirmDropStash(stash)
              },
            }))))))
    }

    function ConsoleTab() {
      const wb = useWb()
      const t = useT()
      const [expanded, setExpanded] = React.useState(null)
      const entries = wb.consoleEntries || []
      return h('div', { className: 'ig-console' },
        h('div', { className: 'ig-console-hdr' },
          h(Icon, { name: 'terminal', size: 14 }),
          h('span', { style: { fontWeight: 600 } }, t('Console')),
          h('span', { className: 'ig-dim', style: { fontSize: 10 } }, `${entries.length}`),
          h('span', { className: 'ig-spacer' }),
          h(Button, { small: true, variant: 'ghost', icon: 'trash', onClick: wb.clearConsole, disabled: !entries.length }, t('Clear'))),
        h('div', { className: 'ig-console-list' },
          !entries.length ? h(EmptyState, { icon: 'terminal', title: t('Console is empty'), text: t('Commands run by this panel appear here.') })
            : entries.map((entry) => h('div', { key: entry.id, className: 'ig-console-row' },
              h('div', {
                className: 'ig-console-line',
                style: { cursor: 'pointer' },
                onClick: () => setExpanded(expanded === entry.id ? null : entry.id),
                title: t('Show command output'),
              },
              h('span', { className: 'ig-method' }, entry.method),
              h('span', { className: 'ig-cmd' }, entry.commands?.[0]?.cmd || (entry.ok ? 'ok' : 'error')),
              h('span', { className: 'ig-ok' }, entry.ok ? h(Icon, { name: 'check', size: 11 }) : h(Icon, { name: 'error', size: 11, className: 'ig-fail' })),
              h('span', { className: 'ig-dim' }, formatDuration(entry.ms)),
              h('span', { className: 'ig-dim' }, new Date(entry.at).toLocaleTimeString())),
              expanded === entry.id ? h('div', null,
                (entry.commands || []).map((command, index) => h('div', { key: index, className: 'ig-console-detail' }, `$ ${command.cmd}\n  exit ${command.code} · ${formatDuration(command.ms)}`)),
                entry.error ? h('div', { className: 'ig-console-detail', style: { color: 'var(--dsw-alias-state-error-primary,#e05a5a)' } }, `${entry.error.code || 'error'}: ${entry.error.message}`) : null) : null))))
    }

    /* ------------------------------------------------------------------ *
     * Dialogs
     * ------------------------------------------------------------------ */
    function ConfirmDialog() {
      const wb = useWb()
      const t = useT()
      const [busy, setBusy] = React.useState(false)
      const confirm = wb.confirm
      React.useEffect(() => {
        setBusy(false)
      }, [confirm])
      if (!confirm) return null
      const run = async () => {
        setBusy(true)
        try {
          if (confirm.run) await confirm.run()
          wb.setConfirm(null)
        } catch (error) {
          wb.notify('error', error.message || t('Unknown error'))
        } finally {
          setBusy(false)
        }
      }
      return h(Modal, {
        open: true,
        title: confirm.title || t('Confirm'),
        icon: 'warning',
        onClose: () => {
          if (!busy) wb.setConfirm(null)
        },
        footer: h(React.Fragment, null,
          h(Button, { variant: 'ghost', onClick: () => wb.setConfirm(null), disabled: busy }, t('Cancel')),
          h(Button, { variant: confirm.danger ? 'danger' : 'primary', onClick: run, busy }, confirm.confirmText || t('OK'))),
      }, h('div', { className: cx('ig-modal-text', confirm.danger && 'ig-dialog-danger') }, confirm.message || t('Are you sure?')))
    }

    function BranchDialog() {
      const wb = useWb()
      const t = useT()
      const dialog = wb.branchDialog || {}
      const [name, setName] = React.useState('')
      const [startPoint, setStartPoint] = React.useState('HEAD')
      const [checkout, setCheckout] = React.useState(true)
      React.useEffect(() => {
        if (!dialog.open) return
        setName('')
        setStartPoint(dialog.startPoint || wb.repo?.head || 'HEAD')
        setCheckout(true)
      }, [dialog.open, dialog.startPoint])
      const submit = async () => {
        if (!name.trim()) return
        const value = await wb.createBranch(name.trim(), startPoint.trim() || 'HEAD', checkout)
        if (value) wb.setBranchDialog(null)
      }
      return h(Modal, {
        open: Boolean(dialog.open),
        title: t('Create branch'),
        icon: 'branch',
        onClose: () => wb.setBranchDialog(null),
        footer: h(React.Fragment, null,
          h(Button, { variant: 'ghost', onClick: () => wb.setBranchDialog(null) }, t('Cancel')),
          h(Button, { variant: 'primary', icon: 'plus', onClick: submit, disabled: !name.trim(), busy: wb.busy === 'createBranch' }, t('Create'))),
      },
      h('div', { className: 'ig-field' },
        h('label', null, t('Branch name')),
        h('div', { className: 'ig-input' }, h('input', { value: name, autoFocus: true, onChange: (event) => setName(event.target.value), onKeyDown: (event) => { if (event.key === 'Enter') submit() }, placeholder: 'feature/my-change', 'aria-label': t('Branch name') }))),
      h('div', { className: 'ig-field' },
        h('label', null, t('Start point')),
        h('div', { className: 'ig-input' }, h('input', { value: startPoint, onChange: (event) => setStartPoint(event.target.value), 'aria-label': t('Start point') }))),
      h('label', { className: 'ig-check' },
        h('input', { type: 'checkbox', checked: checkout, onChange: (event) => setCheckout(event.target.checked) }),
        t('Checkout after create')))
    }

    function PushDialog() {
      const wb = useWb()
      const t = useT()
      const dialog = wb.pushDialog || {}
      const [remote, setRemote] = React.useState('')
      const [branch, setBranch] = React.useState('')
      const [setUpstream, setSetUpstream] = React.useState(true)
      React.useEffect(() => {
        if (!dialog.open) return
        setRemote(wb.repo?.remote || wb.repo?.remotes?.[0] || 'origin')
        setBranch(wb.repo?.branch || '')
        setSetUpstream(!wb.repo?.upstream)
      }, [dialog.open, wb.repo?.remote, wb.repo?.branch, wb.repo?.upstream])
      const submit = async () => {
        const value = await wb.pushRemote({ remote, branch: branch.trim(), setUpstream })
        if (value) wb.setPushDialog(null)
      }
      return h(Modal, {
        open: Boolean(dialog.open),
        title: t('Push branch'),
        icon: 'push',
        onClose: () => wb.setPushDialog(null),
        footer: h(React.Fragment, null,
          h(Button, { variant: 'ghost', onClick: () => wb.setPushDialog(null) }, t('Cancel')),
          h(Button, { variant: 'primary', icon: 'push', onClick: submit, disabled: !remote || !branch.trim(), busy: wb.busy === 'push' }, t('Push'))),
      },
      h('div', { className: 'ig-field' },
        h('label', null, t('Remote')),
        h('select', {
          className: 'ig-select',
          value: remote,
          onChange: (event) => setRemote(event.target.value),
          'aria-label': t('Remote'),
        }, (wb.repo?.remotes?.length ? wb.repo.remotes : ['origin']).map((name) => h('option', { key: name, value: name }, name)))),
      h('div', { className: 'ig-field' },
        h('label', null, t('Branch')),
        h('div', { className: 'ig-input' }, h('input', { value: branch, onChange: (event) => setBranch(event.target.value), placeholder: 'main', 'aria-label': t('Branch') }))),
      h('label', { className: 'ig-check' },
        h('input', { type: 'checkbox', checked: setUpstream, onChange: (event) => setSetUpstream(event.target.checked) }),
        t('Set upstream')))
    }

    function ResetDialog() {
      const wb = useWb()
      const t = useT()
      const dialog = wb.resetDialog || {}
      const [mode, setMode] = React.useState('mixed')
      React.useEffect(() => {
        if (dialog.open) setMode('mixed')
      }, [dialog.open])
      const submit = async () => {
        const value = await wb.doReset(dialog.ref, mode)
        if (value) wb.setResetDialog(null)
      }
      return h(Modal, {
        open: Boolean(dialog.open),
        title: t('Reset'),
        icon: 'refresh',
        onClose: () => wb.setResetDialog(null),
        footer: h(React.Fragment, null,
          h(Button, { variant: 'ghost', onClick: () => wb.setResetDialog(null) }, t('Cancel')),
          h(Button, { variant: 'danger', onClick: submit, busy: wb.busy === 'reset' }, t('Reset'))),
      },
      h('div', { className: 'ig-modal-text' }, `${t('Reset branch to')} ${shortHash(dialog.ref)}`),
      h('div', { className: 'ig-seg', style: { alignSelf: 'flex-start' } },
        ['soft', 'mixed', 'hard'].map((value) => h('button', {
          key: value,
          type: 'button',
          className: cx(mode === value && 'ig-active'),
          onClick: () => setMode(value),
        }, t(value === 'soft' ? 'Soft' : value === 'mixed' ? 'Mixed' : 'Hard')))),
      mode === 'hard' ? h('div', { className: 'ig-warn-box' }, h(Icon, { name: 'warning', size: 13 }), h('span', null, t('Hard reset discards all working tree changes.'))) : null)
    }

    function StashDialog() {
      const wb = useWb()
      const t = useT()
      const dialog = wb.stashDialog || {}
      const [message, setMessage] = React.useState('')
      const [includeUntracked, setIncludeUntracked] = React.useState(true)
      React.useEffect(() => {
        if (!dialog.open) return
        setMessage('')
        setIncludeUntracked(true)
      }, [dialog.open])
      const submit = async () => {
        const value = await wb.createStash(message, includeUntracked)
        if (value) wb.setStashDialog(null)
      }
      return h(Modal, {
        open: Boolean(dialog.open),
        title: t('Stash all local changes'),
        icon: 'stash',
        onClose: () => wb.setStashDialog(null),
        footer: h(React.Fragment, null,
          h(Button, { variant: 'ghost', onClick: () => wb.setStashDialog(null) }, t('Cancel')),
          h(Button, { variant: 'primary', icon: 'stash', onClick: submit, busy: wb.busy === 'stashPush' }, t('Stash'))),
      },
      h('div', { className: 'ig-field' },
        h('label', null, t('Stash message')),
        h('div', { className: 'ig-input' }, h('input', { value: message, autoFocus: true, onChange: (event) => setMessage(event.target.value), placeholder: t('Optional message'), onKeyDown: (event) => { if (event.key === 'Enter') submit() }, 'aria-label': t('Stash message') }))),
      h('label', { className: 'ig-check' },
        h('input', { type: 'checkbox', checked: includeUntracked, onChange: (event) => setIncludeUntracked(event.target.checked) }),
        t('Include untracked files')))
    }

    function TagDialog() {
      const wb = useWb()
      const t = useT()
      const dialog = wb.tagDialog || {}
      const [name, setName] = React.useState('')
      const [message, setMessage] = React.useState('')
      React.useEffect(() => {
        if (!dialog.open) return
        setName('')
        setMessage('')
      }, [dialog.open, dialog.ref])
      const submit = async () => {
        if (!name.trim()) return
        const value = await wb.createTag(name.trim(), message, dialog.ref)
        if (value) wb.setTagDialog(null)
      }
      return h(Modal, {
        open: Boolean(dialog.open),
        title: t('Create tag'),
        icon: 'tag',
        onClose: () => wb.setTagDialog(null),
        footer: h(React.Fragment, null,
          h(Button, { variant: 'ghost', onClick: () => wb.setTagDialog(null) }, t('Cancel')),
          h(Button, { variant: 'primary', icon: 'tag', onClick: submit, disabled: !name.trim(), busy: wb.busy === 'tagCreate' }, t('Create'))),
      },
      h('div', { className: 'ig-field' },
        h('label', null, t('Tag name')),
        h('div', { className: 'ig-input' }, h('input', { value: name, autoFocus: true, onChange: (event) => setName(event.target.value), placeholder: 'v1.0.0', onKeyDown: (event) => { if (event.key === 'Enter') submit() }, 'aria-label': t('Tag name') }))),
      h('div', { className: 'ig-field' },
        h('label', null, t('Tag message')),
        h('textarea', { className: 'ig-textarea', value: message, onChange: (event) => setMessage(event.target.value), placeholder: t('Optional message'), 'aria-label': t('Tag message') })),
      h('div', { className: 'ig-hint' }, t('Annotated tags store a message and creator metadata.')),
      h('div', { className: 'ig-hint' }, `${t('Create tag')}: ${shortHash(dialog.ref || 'HEAD')}`))
    }

    function CompareDialog() {
      const wb = useWb()
      const t = useT()
      const compare = wb.compare
      if (!compare?.open) return null
      const data = compare.data
      const files = data?.files || []
      const openFile = (file) => {
        if (!data) return
        wb.closeCompare()
        wb.openDiff({
          kind: 'range',
          base: data.base,
          target: data.target,
          file: file.path,
          oldPath: file.oldPath,
          status: file.status,
          additions: file.additions,
          deletions: file.deletions,
          binary: file.binary,
        })
      }
      return h(Modal, {
        open: true,
        title: t('Compare with current'),
        icon: 'diff',
        width: 'min(720px, 100%)',
        onClose: () => wb.closeCompare(),
        footer: h(Button, { variant: 'ghost', onClick: () => wb.closeCompare() }, t('Close')),
      },
      compare.loading ? h(SkeletonLines, { count: 6 }) : compare.error ? h(ErrorBox, { error: compare.error }) : !files.length ? h(EmptyState, { icon: 'diff', title: t('No changes between these refs') }) : h(React.Fragment, null,
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
          h('span', { className: 'ig-badge ig-local' }, shortHash(data.base)),
          h(Icon, { name: 'arrowRight', size: 13 }),
          h('span', { className: 'ig-badge ig-head' }, shortHash(data.target)),
          h('span', { className: 'ig-dim', style: { fontSize: 10.5 } }, `${compare.base || ''} → ${compare.target || 'HEAD'}`),
          h('span', { style: { flex: 1 } }),
          h('span', { className: 'ig-dim' }, `${formatNumber(data.totalFiles)} ${t('files')}`),
          h('span', { className: 'ig-add' }, `+${formatNumber(data.totalAdditions)}`),
          h('span', { className: 'ig-del' }, `-${formatNumber(data.totalDeletions)}`)),
        h('div', { className: 'ig-compare-list' }, files.map((file) => {
          const meta = statusMeta(file.status)
          return h('button', {
            key: file.path,
            type: 'button',
            className: 'ig-compare-row',
            onClick: () => openFile(file),
            title: file.path,
          },
          h('span', { className: cx('ig-status-chip', `ig-${meta.tone}`) }, String(file.status || '?').slice(0, 1)),
          h('span', { className: 'ig-file-name', style: { flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, file.path),
          file.binary ? h('span', { className: 'ig-dim', style: { fontSize: 9.5 } }, 'bin') : h(React.Fragment, null,
            h('span', { className: 'ig-add', style: { fontSize: 10 } }, `+${file.additions || 0}`),
            h('span', { className: 'ig-del', style: { fontSize: 10 } }, `-${file.deletions || 0}`)),
          h(Icon, { name: 'chevronRight', size: 12 }))
        }))))
    }

    function RebaseDialog() {
      const wb = useWb()
      const t = useT()
      const dialog = wb.rebaseDialog || {}
      const [steps, setSteps] = React.useState([])
      const [error, setError] = React.useState(null)
      React.useEffect(() => {
        if (!dialog.open) return
        setSteps((dialog.steps || []).map((step) => ({ ...step })))
        setError(dialog.error || null)
      }, [dialog.open, dialog.steps, dialog.error])
      const move = (index, delta) => {
        const next = [...steps]
        const target = index + delta
        if (target < 0 || target >= next.length) return
        const temp = next[index]
        next[index] = next[target]
        next[target] = temp
        setSteps(next)
      }
      const changeAction = (index, action) => {
        setSteps((previous) => previous.map((step, stepIndex) => (stepIndex === index ? { ...step, action } : step)))
      }
      const submit = async () => {
        const kept = steps.filter((step) => step.action !== 'drop')
        if (!kept.length) {
          setError(new Error(t('The plan drops every commit.')))
          return
        }
        if (kept[0].action !== 'pick') {
          setError(new Error(t('The first kept commit must be a pick.')))
          return
        }
        setError(null)
        try {
          await wb.applyRebase(dialog.base, steps)
          wb.setRebaseDialog(null)
        } catch (failure) {
          setError(failure)
        }
      }
      const actions = [['pick', t('Pick')], ['squash', t('Squash')], ['fixup', t('Fixup')], ['drop', t('Drop')]]
      let body
      if (dialog.loading) {
        body = h(SkeletonLines, { count: 8 })
      } else if (!steps.length) {
        body = h(React.Fragment, null,
          error ? h(ErrorBox, { error }) : null,
          h(EmptyState, {
            icon: 'commit',
            title: t('No commits to rebase'),
            text: t('History contains merge commits; only the linear range above the newest merge is available.'),
          }))
      } else {
        body = h(React.Fragment, null,
          error ? h(ErrorBox, { error }) : null,
          h('div', { className: 'ig-warn-box' },
            h(Icon, { name: 'warning', size: 14 }),
            h('span', null, t('Rewrites the selected commits. This cannot be undone.'))),
          h('div', { className: 'ig-hint' }, `${dialog.base ? shortHash(dialog.base) : ''}..HEAD`),
          h('div', { className: 'ig-rebase-list' }, steps.map((step, index) => h('div', { key: step.hash, className: 'ig-rebase-row' },
            h('span', { className: 'ig-rebase-order' }, String(index + 1)),
            h('span', { className: 'ig-hash', style: { width: 76, flex: 'none' } }, shortHash(step.hash)),
            h('span', { className: 'ig-rebase-subject', title: step.subject }, step.subject || '(no subject)'),
            h('select', {
              className: 'ig-select',
              value: step.action,
              onChange: (event) => changeAction(index, event.target.value),
              'aria-label': t('Pick'),
            }, actions.map(([value, label]) => h('option', { key: value, value }, label))),
            h('span', { style: { display: 'flex', gap: 1, flex: 'none' } },
              h(IconButton, { icon: 'arrowUp', label: t('Move up'), size: 13, disabled: index === 0, onClick: () => move(index, -1) }),
              h(IconButton, { icon: 'arrowDown', label: t('Move down'), size: 13, disabled: index === steps.length - 1, onClick: () => move(index, 1) }))))))
      }
      return h(Modal, {
        open: Boolean(dialog.open),
        title: t('Interactive rebase'),
        icon: 'commit',
        width: 'min(760px, 100%)',
        onClose: () => wb.setRebaseDialog(null),
        footer: h(React.Fragment, null,
          h(Button, { variant: 'ghost', onClick: () => wb.setRebaseDialog(null) }, t('Cancel')),
          h(Button, { variant: 'primary', icon: 'commit', onClick: submit, disabled: dialog.loading || !steps.length, busy: wb.busy === 'rebaseApply' }, t('Apply rebase'))),
      }, body)
    }

    /* ------------------------------------------------------------------ *
     * Repository and branch popovers
     * ------------------------------------------------------------------ */
    function RepoPopover() {
      const wb = useWb()
      const t = useT()
      const [path, setPath] = React.useState('')
      const popover = wb.popover?.kind === 'repo' ? wb.popover : null
      if (!popover) return null
      const workspaces = wb.boot?.workspaces || []
      const submit = () => {
        if (!path.trim()) return
        wb.openRepo(path.trim())
        wb.setPopover(null)
      }
      return h(Popover, { popover, onClose: () => wb.setPopover(null), width: 400 },
        h('div', { className: 'ig-popover-hdr' },
          h('div', { className: 'ig-input' },
            h(Icon, { name: 'folder', size: 13 }),
            h('input', {
              value: path,
              autoFocus: true,
              placeholder: t('Repository path'),
              onChange: (event) => setPath(event.target.value),
              onKeyDown: (event) => {
                if (event.key === 'Enter') submit()
              },
              'aria-label': t('Repository path'),
            }),
            path ? h('button', { type: 'button', className: 'ig-input-clear', onClick: submit, 'aria-label': t('Open') }, h(Icon, { name: 'arrowRight', size: 12 })) : null)),
        h('div', { className: 'ig-popover-scroll' },
          workspaces.map((workspace) => h('div', { key: workspace.id },
            h('div', { className: 'ig-menu-title', style: { paddingTop: 7 } }, workspace.title || basename(workspace.path)),
            h('div', { className: 'ig-hint', style: { padding: '0 8px 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, title: workspace.path }, workspace.path),
            (workspace.repos || []).map((repoPath) => h('button', {
              key: repoPath,
              type: 'button',
              className: 'ig-popover-row',
              onClick: () => {
                wb.openRepo(repoPath)
                wb.setPopover(null)
              },
            },
            h(Icon, { name: 'git', size: 13 }),
            h('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' } }, basename(repoPath)),
            wb.repo?.root === repoPath ? h(Icon, { name: 'check', size: 13, style: { color: 'var(--dsw-alias-brand-primary,#4c8dff)' } }) : null)),
            (!workspace.repos || !workspace.repos.length) ? h('div', { className: 'ig-hint', style: { padding: '2px 8px 7px' } }, t('No Git repository found')) : null)),
          !workspaces.length ? h('div', { className: 'ig-popover-empty' }, t('No workspaces are registered yet.')) : null),
        h('div', { style: { display: 'flex', gap: 6, padding: 7, borderTop: '1px solid var(--dsw-alias-border-l1,#303237)' } },
          h(Button, { small: true, variant: 'ghost', icon: 'refresh', onClick: () => wb.rescan(), busy: wb.boot?.loading }, t('Scan again')),
          h('span', { style: { flex: 1 } }),
          h('span', { className: 'ig-hint', style: { alignSelf: 'center' } }, wb.boot?.gitVersion || '')))
    }

    function BranchPopover() {
      const wb = useWb()
      const t = useT()
      const [query, setQuery] = React.useState('')
      const popover = wb.popover?.kind === 'branch' ? wb.popover : null
      if (!popover) return null
      const filter = (entry) => !query.trim() || entry.name.toLowerCase().includes(query.trim().toLowerCase())
      const local = (wb.refs?.local || []).filter(filter)
      const remote = (wb.refs?.remote || []).filter(filter).slice(0, 40)
      const choose = (name) => {
        wb.setPopover(null)
        wb.checkoutRef(name)
      }
      return h(Popover, { popover, onClose: () => wb.setPopover(null), width: 360 },
        h('div', { className: 'ig-popover-hdr' },
          h('div', { className: 'ig-input' },
            h(Icon, { name: 'search', size: 12 }),
            h('input', { value: query, autoFocus: true, placeholder: t('Search branches'), onChange: (event) => setQuery(event.target.value), 'aria-label': t('Search branches') })),
          h('button', {
            type: 'button',
            className: 'ig-btn ig-ghost ig-small',
            style: { marginTop: 5 },
            onClick: () => {
              wb.setPopover(null)
              wb.setBranchDialog({ open: true, startPoint: wb.repo?.head || 'HEAD' })
            },
          }, h(Icon, { name: 'plus', size: 12 }), t('New branch from here…'))),
        h('div', { className: 'ig-popover-scroll' },
          h('div', { className: 'ig-menu-title' }, t('Local')),
          local.length ? local.map((entry) => h('button', {
            key: entry.name,
            type: 'button',
            className: 'ig-popover-row',
            onClick: () => choose(entry.name),
          },
          h(Icon, { name: entry.head ? 'commit' : 'branch', size: 12, style: entry.head ? { color: 'var(--dsw-alias-brand-primary,#4c8dff)' } : undefined }),
          h('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' } }, entry.name),
          entry.head ? h('span', { className: 'ig-badge ig-head' }, t('Current')) : null)) : h('div', { className: 'ig-popover-empty' }, t('No matching branches')),
          remote.length ? h('div', null,
            h('div', { className: 'ig-menu-title', style: { marginTop: 3 } }, t('Remote')),
            remote.map((entry) => h('button', {
              key: entry.name,
              type: 'button',
              className: 'ig-popover-row',
              onClick: () => choose(entry.name),
            },
            h(Icon, { name: 'external', size: 12 }),
            h('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' } }, entry.name)))) : null))
    }

    /* ------------------------------------------------------------------ *
     * Chrome: header, operation banner, tabs, status bar
     * ------------------------------------------------------------------ */
    function Header() {
      const wb = useWb()
      const t = useT()
      const repo = wb.repo
      const busy = wb.busy
      const openRepo = (event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        wb.setPopover({ kind: 'repo', anchor: rect })
      }
      const openBranch = (event) => {
        if (!repo) return
        const rect = event.currentTarget.getBoundingClientRect()
        wb.setPopover({ kind: 'branch', anchor: rect })
      }
      const more = (event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        wb.setMenu({
          x: rect.right - 230,
          y: rect.bottom + 4,
          items: [
            { label: t('Pull with rebase'), icon: 'pull', disabled: !repo || Boolean(busy), onClick: () => wb.pull(true) },
            { label: t('Fetch'), icon: 'fetch', disabled: !repo || Boolean(busy), onClick: () => wb.fetch() },
            { label: t('Interactive rebase…'), icon: 'commit', disabled: !repo || Boolean(busy), onClick: () => wb.openRebase() },
            { type: 'separator' },
            { label: t('Rescan repositories'), icon: 'refresh', onClick: () => wb.rescan() },
            { label: t('Copy repository path'), icon: 'copy', disabled: !repo, onClick: () => wb.copyText(repo.root, repo.root) },
            { label: t('Console'), icon: 'terminal', onClick: () => wb.setTab('console') },
            repo?.operation ? { type: 'separator' } : null,
            repo?.operation ? { label: t('Abort operation'), icon: 'warning', danger: true, onClick: () => wb.abortOperation() } : null,
          ].filter(Boolean),
        })
      }
      return h('header', { className: 'ig-hdr' },
        h('div', { className: 'ig-logo' }, h(Icon, { name: 'git', size: 18 })),
        h('span', { className: 'ig-title' }, t('Git workbench')),
        h('button', { type: 'button', className: 'ig-repo', onClick: openRepo, title: repo ? repo.root : t('Open repository') },
          h(Icon, { name: 'folder', size: 13, style: { color: 'var(--dsw-alias-label-secondary,#9aa0a6)' } }),
          h('span', { className: 'ig-repo-name' }, repo ? repo.name : t('Open repository')),
          repo && repo.name !== basename(repo.root) ? h('span', { className: 'ig-repo-path' }, repo.root) : null,
          h(Icon, { name: 'chevronDown', size: 11, style: { color: 'var(--dsw-alias-label-secondary,#9aa0a6)' } })),
        repo ? h('button', { type: 'button', className: 'ig-branch-chip', onClick: openBranch, title: t('Branches') },
          h(Icon, { name: repo.detached ? 'commit' : 'branch', size: 13, style: { color: 'var(--dsw-alias-brand-primary,#4c8dff)' } }),
          h('span', { className: 'ig-ellipsis', style: { maxWidth: 150, fontWeight: 600 } }, repo.detached ? `HEAD ${shortHash(repo.head)}` : repo.branch || 'HEAD'),
          repo.upstream ? h('span', { className: 'ig-tracking', style: { maxWidth: 88, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, repo.upstream) : null,
          repo.ahead ? h('span', { className: 'ig-tracking ig-ahead' }, `↑${repo.ahead}`) : null,
          repo.behind ? h('span', { className: 'ig-tracking ig-behind' }, `↓${repo.behind}`) : null,
          h(Icon, { name: 'chevronDown', size: 10 })) : null,
        h('div', { className: 'ig-toolbar' },
          repo ? h(React.Fragment, null,
            h('button', { type: 'button', className: 'ig-iconbtn', onClick: () => wb.fetch(), disabled: Boolean(busy), title: t('Fetch'), 'aria-label': t('Fetch') },
              busy === 'fetch' ? h(Spinner) : h(Icon, { name: 'fetch', size: 15 }), h('span', { className: 'ig-btn-label ig-action-label' }, t('Fetch'))),
            h('button', { type: 'button', className: 'ig-iconbtn', onClick: () => wb.pull(false), disabled: Boolean(busy), title: t('Pull'), 'aria-label': t('Pull') },
              busy === 'pull' ? h(Spinner) : h(Icon, { name: 'pull', size: 15 }), h('span', { className: 'ig-btn-label ig-action-label' }, t('Pull'))),
            h('button', { type: 'button', className: 'ig-iconbtn', onClick: () => wb.setPushDialog({ open: true }), disabled: Boolean(busy), title: t('Push'), 'aria-label': t('Push') },
              busy === 'push' ? h(Spinner) : h(Icon, { name: 'push', size: 15 }), h('span', { className: 'ig-btn-label ig-action-label' }, t('Push'))),
            h(IconButton, { icon: 'refresh', label: t('Refresh'), onClick: () => wb.refreshAll(false), busy: wb.refreshing })) : null,
          h(IconButton, { icon: 'more', label: t('More'), onClick: more })))
    }

    function OperationBanner() {
      const wb = useWb()
      const t = useT()
      const operation = wb.repo?.operation
      if (!operation) return null
      const labels = {
        merging: t('Merging'),
        rebasing: t('Rebasing'),
        'cherry-picking': t('Cherry-picking'),
        reverting: t('Reverting'),
        bisecting: t('Bisecting'),
      }
      return h('div', { className: 'ig-banner' },
        h(Icon, { name: 'warning', size: 14 }),
        h('span', null, `${labels[operation] || operation}. ${t('Resolve conflicts, stage the files, then continue.')}`),
        h('span', { className: 'ig-spacer' }),
        h(Button, { small: true, variant: 'ghost', onClick: () => wb.continueOperation(), busy: wb.busy === 'continue' }, t('Continue')),
        h(Button, { small: true, variant: 'danger', onClick: () => wb.abortOperation(), busy: wb.busy === 'abort' }, t('Abort')))
    }

    function TabBar() {
      const wb = useWb()
      const t = useT()
      const changes = wb.status ? ['staged', 'unstaged', 'conflicted', 'untracked'].reduce((sum, key) => sum + (wb.status[key]?.length || 0), 0) : 0
      const tabs = [
        { id: 'log', label: t('Log'), icon: 'git', count: wb.commits.length },
        { id: 'changes', label: t('Local Changes'), icon: 'diff', count: changes },
        { id: 'history', label: t('File History'), icon: 'clock' },
        { id: 'blame', label: t('Blame'), icon: 'user' },
        { id: 'stash', label: t('Stash'), icon: 'stash', count: wb.stashes.length },
        { id: 'console', label: t('Console'), icon: 'terminal' },
      ]
      return h('div', { className: 'ig-tabs', role: 'tablist' },
        tabs.map((tab) => h('button', {
          key: tab.id,
          type: 'button',
          role: 'tab',
          className: cx('ig-tab', wb.tab === tab.id && 'ig-active'),
          'aria-selected': wb.tab === tab.id ? 'true' : 'false',
          onClick: () => wb.setTab(tab.id),
        },
        h(Icon, { name: tab.icon, size: 13 }),
        h('span', null, tab.label),
        tab.count ? h('span', { className: 'ig-tab-count' }, formatNumber(tab.count)) : null)))
    }

    function StatusBar() {
      const wb = useWb()
      const t = useT()
      const repo = wb.repo
      const status = wb.status
      const changes = status ? ['staged', 'unstaged', 'conflicted', 'untracked'].reduce((sum, key) => sum + (status[key]?.length || 0), 0) : 0
      return h('footer', { className: 'ig-status' },
        h('span', { className: cx('ig-status-dot', changes > 0 && 'ig-dirty'), title: changes > 0 ? t('Working tree has changes') : t('Clean') }),
        h(Icon, { name: 'branch', size: 12 }),
        h('span', null, repo ? (repo.detached ? `HEAD ${shortHash(repo.head)}` : repo.branch || 'HEAD') : t('No repository')),
        repo?.upstream ? h('span', null, `${repo.ahead ? `↑${repo.ahead}` : ''}${repo.behind ? ` ↓${repo.behind}` : ''}`) : null,
        changes ? h('span', null, `${changes} ${t('changes')}`) : h('span', null, t('Clean')),
        repo?.operation ? h('span', { style: { color: 'var(--dsw-alias-state-warn-primary,#d8a23a)' } }, repo.operation) : null,
        h('span', { className: 'ig-spacer' }),
        repo ? h('span', { title: repo.root, style: { overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 420 } }, shortPath(repo.root)) : null,
        repo?.shallow ? h('span', null, 'shallow') : null,
        wb.boot?.gitVersion ? h('span', null, wb.boot.gitVersion.replace(/^git version\s*/, 'Git ')) : null,
        wb.lastUpdated ? h('span', { title: formatAbsolute(wb.lastUpdated / 1000) }, `${t('Updated')} ${new Date(wb.lastUpdated).toLocaleTimeString()}`) : null)
    }

    function NoRepo() {
      const wb = useWb()
      const t = useT()
      const [path, setPath] = React.useState('')
      const boot = wb.boot || {}
      if (boot.loading) {
        return h('div', { className: 'ig-empty' },
          h('span', { className: 'ig-spinner', style: { width: 22, height: 22 } }),
          h('div', { className: 'ig-empty-title' }, t('Loading repository…')))
      }
      if (boot.error) {
        return h('div', { className: 'ig-empty' },
          h(ErrorBox, { error: boot.error, onRetry: () => wb.loadBootstrap(undefined, true) }),
          h(Button, { onClick: () => wb.rescan() }, t('Scan again')))
      }
      const workspaces = boot.workspaces || []
      const repos = workspaces.flatMap((workspace) => (workspace.repos || []).map((repoPath) => ({ workspace, repoPath })))
      return h('div', { style: { flex: 1, overflow: 'auto' } },
        h('div', { className: 'ig-empty', style: { minHeight: 220 } },
          h('div', { className: 'ig-empty-icon' }, h(Icon, { name: 'git', size: 22 })),
          h('div', { className: 'ig-empty-title' }, t('No Git repository found')),
          h('div', { className: 'ig-empty-text' }, boot.warning || t('This workspace is not a Git repository. Open a repository path or scan again after initializing one.')),
          !boot.gitVersion ? h('div', { className: 'ig-warn-box', style: { maxWidth: 560 } },
            h(Icon, { name: 'warning', size: 14 }),
            h('div', null,
              h('div', { style: { fontWeight: 600 } }, t('Git was not found')),
              h('div', null, t('Install Git and restart the Harness.')))) : null,
          h('div', { style: { display: 'flex', gap: 6, width: 'min(560px, 100%)', marginTop: 4 } },
            h('div', { className: 'ig-input', style: { flex: 1, height: 30 } },
              h(Icon, { name: 'folder', size: 13 }),
              h('input', {
                value: path,
                placeholder: t('Repository path'),
                onChange: (event) => setPath(event.target.value),
                onKeyDown: (event) => {
                  if (event.key === 'Enter' && path.trim()) wb.openRepo(path.trim())
                },
                'aria-label': t('Repository path'),
              })),
            h(Button, { variant: 'primary', icon: 'folder', onClick: () => path.trim() && wb.openRepo(path.trim()), disabled: !path.trim() }, t('Open'))),
          h(Button, { small: true, variant: 'ghost', icon: 'refresh', onClick: () => wb.rescan(), busy: boot.loading }, t('Scan again'))),
        repos.length ? h('div', { style: { maxWidth: 760, margin: '0 auto 28px', padding: '0 16px' } },
          h('div', { className: 'ig-menu-title' }, t('Repositories')),
          repos.map(({ workspace, repoPath }) => h('button', {
            key: repoPath,
            type: 'button',
            className: 'ig-popover-row',
            style: { border: '1px solid var(--dsw-alias-border-l1,#303237)', marginBottom: 5, borderRadius: 6 },
            onClick: () => wb.openRepo(repoPath),
          },
          h(Icon, { name: 'git', size: 14, style: { color: 'var(--dsw-alias-brand-primary,#4c8dff)' } }),
          h('div', { style: { flex: 1, minWidth: 0 } },
            h('div', { style: { fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' } }, basename(repoPath)),
            h('div', { className: 'ig-hint', style: { overflow: 'hidden', textOverflow: 'ellipsis' } }, repoPath)),
          h(Icon, { name: 'arrowRight', size: 13 })))) : null,
        !workspaces.length ? h('div', { className: 'ig-empty-text', style: { textAlign: 'center' } }, t('No workspaces are registered yet.')) : null)
    }

    /* ------------------------------------------------------------------ *
     * Application
     * ------------------------------------------------------------------ */
    function App() {
      const t = useT()
      const savedRef = React.useRef(null)
      if (savedRef.current === null) savedRef.current = loadUiState()
      const saved = savedRef.current || {}
      const savedFilters = saved.filters && typeof saved.filters === 'object' ? saved.filters : {}
      const savedRefs = Array.isArray(savedFilters.refs) ? savedFilters.refs.filter((value) => typeof value === 'string') : []

      const [boot, setBoot] = React.useState({ loading: true, workspaces: [], gitVersion: '', error: null, warning: '', attribution: null })
      const [repo, setRepo] = React.useState(null)
      const [refs, setRefs] = React.useState({ local: [], remote: [], tags: [], all: [], current: '' })
      const [commits, setCommits] = React.useState([])
      const [logLoading, setLogLoading] = React.useState(false)
      const [logLoadingMore, setLogLoadingMore] = React.useState(false)
      const [logError, setLogError] = React.useState(null)
      const [hasMore, setHasMore] = React.useState(false)
      const [selectedHash, setSelectedHash] = React.useState(null)
      const [detail, setDetail] = React.useState(null)
      const [detailLoading, setDetailLoading] = React.useState(false)
      const [detailError, setDetailError] = React.useState(null)
      const [status, setStatus] = React.useState(null)
      const [refreshingStatus, setRefreshingStatus] = React.useState(false)
      const [stashes, setStashes] = React.useState([])
      const [stashesLoading, setStashesLoading] = React.useState(false)
      const [filesData, setFilesData] = React.useState(null)
      const [filesLoading, setFilesLoading] = React.useState(false)
      const [historyFile, setHistoryFile] = React.useState(null)
      const [historyData, setHistoryData] = React.useState(null)
      const [historyLoading, setHistoryLoading] = React.useState(false)
      const [historyError, setHistoryError] = React.useState(null)
      const [blameFile, setBlameFile] = React.useState(null)
      const [blameRev, setBlameRev] = React.useState('HEAD')
      const [blameIgnoreWs, setBlameIgnoreWs] = React.useState(false)
      const [blameData, setBlameData] = React.useState(null)
      const [blameLoading, setBlameLoading] = React.useState(false)
      const [blameError, setBlameError] = React.useState(null)
      const [diffTarget, setDiffTarget] = React.useState(null)
      const [diffData, setDiffData] = React.useState(null)
      const [diffLoading, setDiffLoading] = React.useState(false)
      const [diffError, setDiffError] = React.useState(null)
      const [diffOpen, setDiffOpen] = React.useState(false)
      const [diffVersion, setDiffVersion] = React.useState(0)
      const [diffMode, setDiffMode] = React.useState(saved.diffMode === 'unified' ? 'unified' : 'split')
      const [ignoreWs, setIgnoreWs] = React.useState(Boolean(saved.ignoreWs))
      const [diffContext, setDiffContext] = React.useState(Number(saved.diffContext) === 0 ? 0 : 3)
      const [showDetails, setShowDetails] = React.useState(saved.showDetails !== false)
      const [detailsWidth, setDetailsWidth] = React.useState(clamp(Number(saved.detailsWidth) || 380, 280, 560))
      const [tab, setTab] = React.useState(['log', 'changes', 'history', 'blame', 'stash', 'console'].includes(saved.tab) ? saved.tab : 'log')
      const [filters, setFilters] = React.useState({
        all: savedRefs.length ? false : savedFilters.all !== false,
        firstParent: Boolean(savedFilters.firstParent),
        refs: savedRefs,
        search: typeof savedFilters.search === 'string' ? savedFilters.search : '',
        author: typeof savedFilters.author === 'string' ? savedFilters.author : '',
        path: typeof savedFilters.path === 'string' ? savedFilters.path : '',
        since: typeof savedFilters.since === 'string' ? savedFilters.since : '',
        until: typeof savedFilters.until === 'string' ? savedFilters.until : '',
      })
      const [busy, setBusy] = React.useState(null)
      const [refreshing, setRefreshing] = React.useState(false)
      const [toasts, setToasts] = React.useState([])
      const [menu, setMenu] = React.useState(null)
      const [popover, setPopover] = React.useState(null)
      const [confirm, setConfirm] = React.useState(null)
      const [branchDialog, setBranchDialog] = React.useState(null)
      const [pushDialog, setPushDialog] = React.useState(null)
      const [resetDialog, setResetDialog] = React.useState(null)
      const [stashDialog, setStashDialog] = React.useState(null)
      const [tagDialog, setTagDialog] = React.useState(null)
      const [compare, setCompare] = React.useState(null)
      const [rebaseDialog, setRebaseDialog] = React.useState(null)
      const [consoleEntries, setConsoleEntries] = React.useState([])
      const [commitMessage, setCommitMessage] = React.useState(typeof saved.commitMessage === 'string' ? saved.commitMessage : '')
      const [amend, setAmend] = React.useState(false)
      const [signoff, setSignoff] = React.useState(false)
      const [selectedChange, setSelectedChange] = React.useState(null)
      const [lastUpdated, setLastUpdated] = React.useState(0)

      const rootRef = React.useRef(null)
      const rootWidth = useElementWidth(rootRef)
      const compact = rootWidth > 0 && rootWidth < 940
      const repoRef = React.useRef(repo)
      repoRef.current = repo
      const filtersRef = React.useRef(filters)
      filtersRef.current = filters
      const commitsRef = React.useRef(commits)
      commitsRef.current = commits
      const hasMoreRef = React.useRef(hasMore)
      hasMoreRef.current = hasMore
      const selectedRef = React.useRef(selectedHash)
      selectedRef.current = selectedHash
      const statusRef = React.useRef(status)
      statusRef.current = status
      const filesDataRef = React.useRef(filesData)
      filesDataRef.current = filesData
      const filesLoadingRef = React.useRef(filesLoading)
      filesLoadingRef.current = filesLoading
      const historyDataRef = React.useRef(historyData)
      historyDataRef.current = historyData
      const historyFileRef = React.useRef(historyFile)
      historyFileRef.current = historyFile
      const blameFileRef = React.useRef(blameFile)
      blameFileRef.current = blameFile
      const blameRevRef = React.useRef(blameRev)
      blameRevRef.current = blameRev
      const blameIgnoreWsRef = React.useRef(blameIgnoreWs)
      blameIgnoreWsRef.current = blameIgnoreWs
      const commitMessageRef = React.useRef(commitMessage)
      commitMessageRef.current = commitMessage
      const amendRef = React.useRef(amend)
      amendRef.current = amend
      const signoffRef = React.useRef(signoff)
      signoffRef.current = signoff
      const logSeq = React.useRef(0)
      const detailSeq = React.useRef(0)
      const diffSeq = React.useRef(0)
      const rpcId = React.useRef(0)
      const toastId = React.useRef(0)
      const compareSeq = React.useRef(0)

      const rpc = React.useCallback(async (method, params = {}, options = {}) => {
        const id = ++rpcId.current
        const started = Date.now()
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), options.timeout || 30_000)
        let response
        try {
          response = await fetch(API, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ method, params }),
            signal: controller.signal,
            credentials: 'same-origin',
          })
        } catch (error) {
          clearTimeout(timer)
          const aborted = error.name === 'AbortError'
          const message = aborted ? 'The Git request timed out.' : 'The Git panel could not reach the Host.'
          setConsoleEntries((previous) => [{
            id,
            at: started,
            method,
            ok: false,
            ms: Date.now() - started,
            commands: [],
            error: { code: aborted ? 'timeout' : 'network', message },
          }, ...previous].slice(0, 250))
          const normalized = new Error(message)
          normalized.code = aborted ? 'timeout' : 'network'
          throw normalized
        }
        clearTimeout(timer)
        let payload
        try {
          payload = await response.json()
        } catch {
          payload = { ok: false, error: { code: 'bad-response', message: `Host returned HTTP ${response.status}.` } }
        }
        const entry = {
          id,
          at: started,
          method,
          ok: response.ok && Boolean(payload?.ok),
          ms: Date.now() - started,
          commands: payload?.meta?.commands || [],
          error: payload?.ok ? null : payload?.error || { code: String(response.status), message: `HTTP ${response.status}` },
        }
        setConsoleEntries((previous) => [entry, ...previous].slice(0, 250))
        if (!response.ok) {
          const error = new Error(response.status === 401 || response.status === 403 ? 'The Git panel is not authorized for this Host.' : `Host returned HTTP ${response.status}.`)
          error.code = response.status === 401 || response.status === 403 ? 'auth' : String(response.status)
          throw error
        }
        if (!payload?.ok) {
          const info = payload?.error || {}
          const error = new Error(info.message || 'Git error')
          error.code = info.code || 'git-error'
          error.detail = info.detail || {}
          throw error
        }
        return payload.value
      }, [])

      const notify = React.useCallback((tone, text) => {
        if (!text) return
        const id = ++toastId.current
        setToasts((previous) => [...previous, { id, tone: tone || 'success', text }].slice(-4))
      }, [])

      const dismissToast = React.useCallback((id) => {
        setToasts((previous) => previous.filter((toast) => toast.id !== id))
      }, [])

      const copyText = React.useCallback(async (text, label) => {
        try {
          if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable')
          await navigator.clipboard.writeText(String(text ?? ''))
          notify('success', `${t('Copied')}: ${label || text}`)
        } catch {
          notify('warn', String(text ?? ''))
        }
      }, [notify, t])

      const loadBootstrap = React.useCallback(async (repoPath, refresh) => {
        setBoot((previous) => ({ ...previous, loading: true, error: null }))
        try {
          const value = await rpc('bootstrap', { repoPath, refresh: Boolean(refresh) })
          setBoot({
            loading: false,
            workspaces: value.workspaces || [],
            gitVersion: value.gitVersion || '',
            error: null,
            warning: value.warning || '',
            attribution: value.attribution || null,
          })
          if (value.repo) {
            setRepo(value.repo)
            saveUiState({ ...loadUiState(), repoPath: value.repo.root })
          } else {
            setRepo(null)
            if (repoPath) notify('error', value.warning || t('No Git repository found'))
          }
        } catch (error) {
          setBoot((previous) => ({ ...previous, loading: false, error }))
          notify('error', error.message || t('Unknown error'))
        }
      }, [notify, rpc, t])

      const refreshStatus = React.useCallback(async (silent = true) => {
        const current = repoRef.current
        if (!current) return null
        setRefreshingStatus(true)
        try {
          const value = await rpc('status', { repo: current.root })
          setStatus(value)
          setLastUpdated(Date.now())
          return value
        } catch (error) {
          if (!silent) notify('error', error.message || t('Unknown error'))
          return null
        } finally {
          setRefreshingStatus(false)
        }
      }, [notify, rpc, t])

      const refreshRefs = React.useCallback(async () => {
        const current = repoRef.current
        if (!current) return null
        try {
          const value = await rpc('refs', { repo: current.root })
          setRefs(value)
          return value
        } catch {
          return null
        }
      }, [rpc])

      const loadStashes = React.useCallback(async () => {
        const current = repoRef.current
        if (!current) return null
        setStashesLoading(true)
        try {
          const value = await rpc('stashes', { repo: current.root })
          setStashes(value.stashes || [])
          return value
        } catch (error) {
          notify('error', error.message || t('Unknown error'))
          return null
        } finally {
          setStashesLoading(false)
        }
      }, [notify, rpc, t])

      const loadFiles = React.useCallback(async (force = false) => {
        const current = repoRef.current
        if (!current) return null
        if (!force && filesDataRef.current) return filesDataRef.current
        if (filesLoadingRef.current) return null
        setFilesLoading(true)
        try {
          const value = await rpc('files', { repo: current.root })
          setFilesData(value)
          return value
        } catch (error) {
          notify('error', error.message || t('Unknown error'))
          return null
        } finally {
          setFilesLoading(false)
        }
      }, [notify, rpc, t])

      const loadLog = React.useCallback(async (append = false) => {
        const current = repoRef.current
        if (!current) return
        if (append && !hasMoreRef.current) return
        const sequence = ++logSeq.current
        if (append) setLogLoadingMore(true)
        else setLogLoading(true)
        setLogError(null)
        const activeFilters = filtersRef.current
        try {
          const value = await rpc('log', {
            repo: current.root,
            all: activeFilters.all,
            firstParent: activeFilters.firstParent,
            refs: activeFilters.refs,
            grep: activeFilters.search,
            author: activeFilters.author,
            path: activeFilters.path,
            since: activeFilters.since,
            until: activeFilters.until,
            limit: append ? 400 : 600,
            skip: append ? commitsRef.current.length : 0,
          })
          if (sequence !== logSeq.current) return
          const incoming = value.commits || []
          if (append) {
            const seen = new Set(commitsRef.current.map((commit) => commit.hash))
            setCommits([...commitsRef.current, ...incoming.filter((commit) => !seen.has(commit.hash))])
          } else {
            setCommits(incoming)
            if (!incoming.some((commit) => commit.hash === selectedRef.current)) {
              setSelectedHash(incoming[0]?.hash || null)
            }
          }
          setHasMore(Boolean(value.hasMore))
          setLastUpdated(Date.now())
        } catch (error) {
          if (sequence === logSeq.current) {
            setLogError(error)
            if (!append) setCommits([])
          }
        } finally {
          if (sequence === logSeq.current) {
            setLogLoading(false)
            setLogLoadingMore(false)
          }
        }
      }, [rpc])

      const refreshAll = React.useCallback(async (silent = true) => {
        const current = repoRef.current
        if (!current) return
        setRefreshing(true)
        try {
          const [info, refsValue, statusValue, stashValue] = await Promise.all([
            rpc('repoInfo', { repo: current.root }),
            rpc('refs', { repo: current.root }),
            rpc('status', { repo: current.root }),
            rpc('stashes', { repo: current.root }),
          ])
          if (info?.repo) setRepo(info.repo)
          setRefs(refsValue)
          setStatus(statusValue)
          setStashes(stashValue.stashes || [])
          setLastUpdated(Date.now())
          await loadLog(false)
          if (selectedRef.current) {
            try {
              const nextDetail = await rpc('commit', { repo: current.root, hash: selectedRef.current })
              setDetail(nextDetail)
            } catch {
              /* the commit may have been removed by the operation */
            }
          }
        } catch (error) {
          if (!silent) notify('error', error.message || t('Unknown error'))
        } finally {
          setRefreshing(false)
        }
      }, [loadLog, notify, rpc, t])

      const perform = React.useCallback(async (action, params = {}, options = {}) => {
        const current = repoRef.current
        if (!current) return null
        setBusy(options.busyKey || action)
        try {
          const value = await rpc('action', { repo: current.root, action, ...params }, { timeout: options.timeout || 120_000 })
          if (value?.repo) setRepo(value.repo)
          if (options.scope === 'status') {
            await refreshStatus(true)
          } else if (options.scope !== 'none') {
            await refreshAll(true)
          }
          setDiffVersion((version) => version + 1)
          if (options.success) notify(options.tone || 'success', options.success)
          return value
        } catch (error) {
          if (!options.silent) notify('error', error.message || t('Unknown error'))
          throw error
        } finally {
          setBusy(null)
        }
      }, [notify, refreshAll, refreshStatus, rpc, t])

      React.useEffect(() => {
        loadBootstrap(saved.repoPath)
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      React.useEffect(() => {
        const current = repo
        if (!current) {
          setRefs({ local: [], remote: [], tags: [], all: [], current: '' })
          setStatus(null)
          setStashes([])
          setFilesData(null)
          setHistoryFile(null)
          setHistoryData(null)
          setBlameFile(null)
          setBlameData(null)
          setSelectedHash(null)
          setDetail(null)
          setDiffTarget(null)
          setDiffOpen(false)
          return undefined
        }
        let cancelled = false
        setRefreshing(true)
        setFilesData(null)
        setHistoryFile(null)
        setHistoryData(null)
        setHistoryError(null)
        setBlameFile(null)
        setBlameData(null)
        setBlameError(null)
        setSelectedHash(null)
        setSelectedChange(null)
        setDetail(null)
        setDetailError(null)
        setDiffTarget(null)
        setDiffOpen(false)
        setCommitMessage('')
        compareSeq.current += 1
        setCompare(null)
        setFilters({ all: true, firstParent: false, refs: [], search: '', author: '', path: '', since: '', until: '' })
        Promise.all([
          rpc('refs', { repo: current.root }),
          rpc('status', { repo: current.root }),
          rpc('stashes', { repo: current.root }),
        ]).then(([refsValue, statusValue, stashValue]) => {
          if (cancelled) return
          setRefs(refsValue)
          setStatus(statusValue)
          setStashes(stashValue.stashes || [])
          setLastUpdated(Date.now())
        }).catch((error) => {
          if (!cancelled) notify('error', error.message || t('Unknown error'))
        }).finally(() => {
          if (!cancelled) setRefreshing(false)
        })
        return () => {
          cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [repo?.root])

      const debouncedSearch = useDebounced(filters.search, 250)
      const debouncedAuthor = useDebounced(filters.author, 250)
      const debouncedPath = useDebounced(filters.path, 250)
      const filterKey = JSON.stringify([filters.all, filters.firstParent, filters.refs, debouncedSearch, debouncedAuthor, debouncedPath, filters.since, filters.until])
      const repoRoot = repo?.root || ''
      React.useEffect(() => {
        if (!repoRef.current) return undefined
        const timer = setTimeout(() => loadLog(false), 40)
        return () => clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [repoRoot, filterKey])

      React.useEffect(() => {
        const current = repoRef.current
        const sequence = ++detailSeq.current
        if (!current || !selectedHash) {
          setDetail(null)
          setDetailError(null)
          setDetailLoading(false)
          return undefined
        }
        setDetailLoading(true)
        setDetailError(null)
        rpc('commit', { repo: current.root, hash: selectedHash }).then((value) => {
          if (sequence === detailSeq.current) setDetail(value)
        }).catch((error) => {
          if (sequence === detailSeq.current) {
            setDetail(null)
            setDetailError(error)
          }
        }).finally(() => {
          if (sequence === detailSeq.current) setDetailLoading(false)
        })
        return () => {
          if (sequence === detailSeq.current) detailSeq.current += 1
        }
      }, [repoRoot, selectedHash, rpc])

      React.useEffect(() => {
        const current = repoRef.current
        if (!current || !diffTarget) {
          setDiffData(null)
          setDiffError(null)
          setDiffLoading(false)
          return undefined
        }
        const sequence = ++diffSeq.current
        const params = { repo: current.root, ignoreWhitespace: ignoreWs, context: diffContext }
        let valid = true
        if (diffTarget.kind === 'commit') {
          if (!diffTarget.hash) valid = false
          else {
            params.hash = diffTarget.hash
            params.file = diffTarget.file
            params.oldPath = diffTarget.oldPath
          }
        } else if (diffTarget.kind === 'stash') {
          params.stash = diffTarget.index
        } else if (diffTarget.kind === 'untracked') {
          params.file = diffTarget.file
          params.untracked = true
        } else if (diffTarget.kind === 'staged') {
          params.file = diffTarget.file
          params.cached = true
        } else if (diffTarget.kind === 'worktree') {
          params.file = diffTarget.file
        } else if (diffTarget.kind === 'range') {
          params.base = diffTarget.base
          params.target = diffTarget.target
          params.file = diffTarget.file
        } else {
          valid = false
        }
        if (!valid) {
          setDiffLoading(false)
          return undefined
        }
        setDiffLoading(true)
        setDiffError(null)
        setDiffData(null)
        rpc('diff', params).then((value) => {
          if (sequence === diffSeq.current) setDiffData(value)
        }).catch((error) => {
          if (sequence === diffSeq.current) setDiffError(error)
        }).finally(() => {
          if (sequence === diffSeq.current) setDiffLoading(false)
        })
        return () => {
          if (sequence === diffSeq.current) diffSeq.current += 1
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [repoRoot, diffTarget, ignoreWs, diffContext, diffVersion])

      const loadHistory = React.useCallback(async () => {
        const current = repoRef.current
        const file = historyFileRef.current
        if (!current || !file) return null
        setHistoryLoading(true)
        setHistoryError(null)
        try {
          const value = await rpc('fileHistory', { repo: current.root, file, limit: 200 })
          setHistoryData(value)
          return value
        } catch (error) {
          setHistoryError(error)
          setHistoryData(null)
          return null
        } finally {
          setHistoryLoading(false)
        }
      }, [rpc])

      const loadBlame = React.useCallback(async () => {
        const current = repoRef.current
        const file = blameFileRef.current
        if (!current || !file) return null
        setBlameLoading(true)
        setBlameError(null)
        try {
          const value = await rpc('blame', {
            repo: current.root,
            file,
            rev: blameRevRef.current || 'HEAD',
            ignoreWhitespace: blameIgnoreWsRef.current,
          })
          setBlameData(value)
          return value
        } catch (error) {
          setBlameError(error)
          setBlameData(null)
          return null
        } finally {
          setBlameLoading(false)
        }
      }, [rpc])

      React.useEffect(() => {
        if (tab !== 'history' || !historyFile || !repoRef.current) return
        if (historyDataRef.current?.file !== historyFile) setHistoryData(null)
        loadHistory()
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [tab, historyFile, repoRoot])

      React.useEffect(() => {
        if (tab !== 'blame' || !blameFile || !repoRef.current) return
        setBlameData(null)
        loadBlame()
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [tab, blameFile, blameRev, blameIgnoreWs, repoRoot])

      React.useEffect(() => {
        if (!repoRef.current) return
        if ((tab === 'history' || tab === 'blame') && !filesDataRef.current && !filesLoadingRef.current) loadFiles()
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [tab, repoRoot])

      React.useEffect(() => {
        if (!repoRef.current) return
        if (tab === 'changes') refreshStatus(true)
        if (tab === 'stash') loadStashes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [tab, repoRoot])

      React.useEffect(() => {
        saveUiState({
          repoPath: repoRef.current?.root || saved.repoPath || '',
          tab,
          filters,
          diffMode,
          ignoreWs,
          diffContext,
          showDetails,
          detailsWidth,
          commitMessage,
        })
      }, [repoRoot, tab, filters, diffMode, ignoreWs, diffContext, showDetails, detailsWidth, commitMessage])

      React.useEffect(() => {
        const onKey = (event) => {
          if (event.key !== 'Escape') return
          if (diffOpen) {
            setDiffOpen(false)
            setDiffTarget(null)
          } else if (menu) {
            setMenu(null)
          } else if (popover) {
            setPopover(null)
          }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
      }, [diffOpen, menu, popover])

      const openRepo = React.useCallback((repoPath) => {
        loadBootstrap(repoPath, false)
      }, [loadBootstrap])

      const rescan = React.useCallback(() => {
        loadBootstrap(repoRef.current?.root || saved.repoPath, true)
      }, [loadBootstrap, saved.repoPath])

      const selectCommit = React.useCallback((hash) => {
        setSelectedHash(hash)
        if (compact) setShowDetails(true)
      }, [compact])

      const toggleDetails = React.useCallback(() => setShowDetails((value) => !value), [])

      const openDiff = React.useCallback((target) => {
        setDiffTarget(target)
        setDiffOpen(true)
        setSelectedChange(null)
      }, [])

      const closeDiff = React.useCallback(() => {
        setDiffOpen(false)
        setDiffTarget(null)
        setDiffData(null)
        setDiffError(null)
      }, [])

      const openChangeDiff = React.useCallback((change) => {
        setSelectedChange(change)
        setDiffOpen(false)
        setDiffTarget({
          kind: change.side === 'staged' ? 'staged' : change.side === 'untracked' ? 'untracked' : 'worktree',
          file: change.path,
          oldPath: change.oldPath,
          status: change.status,
        })
      }, [])

      const openHistoryFor = React.useCallback((file) => {
        setHistoryFile(file)
        setTab('history')
        setShowDetails(true)
        if (!filesDataRef.current) loadFiles()
      }, [loadFiles])

      const openBlameFor = React.useCallback((file, rev) => {
        setBlameFile(file)
        setBlameRev(rev || 'HEAD')
        setTab('blame')
        setShowDetails(true)
        if (!filesDataRef.current) loadFiles()
      }, [loadFiles])

      const openRemote = React.useCallback((hash, file) => {
        const url = remoteWebUrl(repoRef.current?.remoteUrl, hash, file)
        if (!url) {
          notify('warn', t('No remote configured'))
          return
        }
        window.open(url, '_blank', 'noopener,noreferrer')
      }, [notify, t])

      const stagePaths = React.useCallback(async (paths) => {
        try {
          await perform('stage', { paths }, { scope: 'status', busyKey: 'stage' })
        } catch {
          /* reported by perform */
        }
      }, [perform])

      const stagePathsAll = React.useCallback(async () => {
        try {
          await perform('stage', { all: true }, { scope: 'status', busyKey: 'stage' })
        } catch {
          /* reported by perform */
        }
      }, [perform])

      const unstagePaths = React.useCallback(async (paths) => {
        try {
          await perform('unstage', { paths }, { scope: 'status', busyKey: 'unstage' })
        } catch {
          /* reported by perform */
        }
      }, [perform])

      const unstageAll = React.useCallback(async () => {
        try {
          await perform('unstage', { all: true }, { scope: 'status', busyKey: 'unstage' })
        } catch {
          /* reported by perform */
        }
      }, [perform])

      const confirmDiscard = React.useCallback((change) => {
        setConfirm({
          title: t('Discard changes'),
          message: `${change.path}\n\n${t('This action cannot be undone.')}`,
          confirmText: t('Discard…'),
          danger: true,
          run: async () => {
            await perform('discard', { entries: [{ path: change.path, oldPath: change.oldPath, untracked: change.side === 'untracked' }] }, {
              scope: 'status',
              busyKey: 'discard',
              silent: true,
            })
            setDiffTarget(null)
            setSelectedChange(null)
          },
        })
      }, [perform, t])

      const commitChanges = React.useCallback(async (pushAfter) => {
        const message = commitMessageRef.current
        const staged = (statusRef.current?.staged?.length || 0) + (statusRef.current?.conflicted?.length || 0)
        if (!message.trim() && !amendRef.current) {
          notify('warn', t('Commit message is empty'))
          return
        }
        if (!staged && !amendRef.current) {
          notify('warn', t('Stage files before committing.'))
          return
        }
        let value
        try {
          value = await perform('commit', {
            message,
            amend: amendRef.current,
            signoff: signoffRef.current,
          }, {
            busyKey: pushAfter ? 'commit-push' : 'commit',
            scope: 'none',
            silent: false,
          })
        } catch {
          return
        }
        setCommitMessage('')
        setAmend(false)
        setSignoff(false)
        setDiffOpen(false)
        setDiffTarget(null)
        setSelectedChange(null)
        notify('success', `${t('Committed')} ${shortHash(value?.hash)}`)
        await refreshAll(true)
        if (pushAfter) {
          try {
            await perform('push', {}, { busyKey: 'push', scope: 'all', timeout: 180_000, success: t('Updated') })
          } catch {
            /* reported by perform */
          }
        }
      }, [notify, perform, refreshAll, t])

      const checkoutRef = React.useCallback(async (ref) => {
        try {
          await perform('checkout', { ref }, { scope: 'all', success: `${t('Checkout')}: ${ref}` })
        } catch {
          /* reported by perform */
        }
      }, [perform, t])

      const createBranch = React.useCallback(async (name, startPoint, checkout) => {
        try {
          return await perform('createBranch', { name, startPoint, checkout }, {
            busyKey: 'createBranch',
            scope: 'all',
            success: `${t('Create branch')}: ${name}`,
          })
        } catch {
          return null
        }
      }, [perform, t])

      const deleteBranch = React.useCallback((entry) => {
        setConfirm({
          title: t('Delete branch'),
          message: `${entry.name}\n\n${t('This action cannot be undone.')}`,
          confirmText: t('Delete'),
          danger: true,
          run: async () => {
            await perform('deleteBranch', { name: entry.name, force: true }, {
              scope: 'all',
              busyKey: 'deleteBranch',
              silent: true,
            })
          },
        })
      }, [perform, t])

      const mergeRef = React.useCallback(async (ref) => {
        try {
          await perform('merge', { ref }, { scope: 'all', busyKey: 'merge', success: `${t('Merge')}: ${ref}` })
        } catch {
          /* reported by perform */
        }
      }, [perform, t])

      const rebaseRef = React.useCallback((ref) => {
        setConfirm({
          title: t('Rebase'),
          message: `${t('Rebase current onto')} ${ref}`,
          confirmText: t('Rebase'),
          danger: true,
          run: async () => {
            await perform('rebase', { ref }, { scope: 'all', busyKey: 'rebase', silent: true })
          },
        })
      }, [perform, t])

      const cherryPick = React.useCallback(async (hash) => {
        try {
          await perform('cherryPick', { ref: hash }, { scope: 'all', busyKey: 'cherryPick', success: `${t('Cherry-pick')}: ${shortHash(hash)}` })
        } catch {
          /* reported by perform */
        }
      }, [perform, t])

      const revertCommit = React.useCallback(async (hash) => {
        try {
          await perform('revert', { ref: hash }, { scope: 'all', busyKey: 'revert', success: `${t('Revert')}: ${shortHash(hash)}` })
        } catch {
          /* reported by perform */
        }
      }, [perform, t])

      const doReset = React.useCallback(async (ref, mode) => {
        try {
          return await perform('reset', { ref, mode }, { scope: 'all', busyKey: 'reset', success: t('Updated') })
        } catch {
          return null
        }
      }, [perform, t])

      const fetchRemote = React.useCallback(async () => {
        try {
          await perform('fetch', {}, { scope: 'all', busyKey: 'fetch', timeout: 180_000, success: t('Updated') })
        } catch {
          /* reported by perform */
        }
      }, [perform, t])

      const pullRemote = React.useCallback(async (rebase) => {
        try {
          await perform('pull', { rebase }, { scope: 'all', busyKey: 'pull', timeout: 180_000, success: t('Updated') })
        } catch {
          /* reported by perform */
        }
      }, [perform, t])

      const pushRemote = React.useCallback(async (options) => {
        try {
          return await perform('push', options, {
            scope: 'all',
            busyKey: 'push',
            timeout: 180_000,
            success: t('Updated'),
          })
        } catch {
          return null
        }
      }, [perform, t])

      const createStash = React.useCallback(async (message, includeUntracked) => {
        try {
          return await perform('stashPush', { message, includeUntracked }, {
            scope: 'all',
            busyKey: 'stashPush',
            success: t('Stashed'),
          })
        } catch {
          return null
        }
      }, [perform, t])

      const stashAction = React.useCallback(async (action, params, label) => {
        try {
          await perform(action, params, { scope: 'all', busyKey: action, success: label })
        } catch {
          /* reported by perform */
        }
      }, [perform])

      const openCompare = React.useCallback(async (ref) => {
        const current = repoRef.current
        if (!current) return
        const target = refs.current || 'HEAD'
        const sequence = ++compareSeq.current
        setCompare({ open: true, base: ref, target, loading: true, data: null, error: null })
        try {
          const data = await rpc('compare', { repo: current.root, base: ref, target })
          if (sequence === compareSeq.current) {
            setCompare({ open: true, base: ref, target, loading: false, data, error: null })
          }
        } catch (error) {
          if (sequence === compareSeq.current) {
            setCompare({ open: true, base: ref, target, loading: false, data: null, error })
          }
        }
      }, [rpc, refs.current])

      const closeCompare = React.useCallback(() => {
        compareSeq.current += 1
        setCompare(null)
      }, [])

      const openRebase = React.useCallback(async () => {
        const current = repoRef.current
        if (!current) return
        setRebaseDialog({ open: true, loading: true, steps: [], base: null, error: null })
        try {
          const value = await rpc('log', { repo: current.root, all: false, firstParent: true, limit: 30 })
          const linear = value.commits || []
          const selected = []
          for (const commit of linear) {
            if ((commit.parents || []).length > 1) break
            selected.push(commit)
          }
          if (!selected.length) throw new Error(t('No commits to rebase'))
          const oldest = selected[selected.length - 1]
          let base
          let commits = selected
          if (!oldest.parents?.length) {
            base = oldest.hash
            commits = selected.slice(0, -1)
          } else {
            base = oldest.parents[0]
          }
          if (commits.length < 2) throw new Error(t('No commits to rebase'))
          const steps = commits.slice().reverse().map((commit) => ({ hash: commit.hash, action: 'pick', subject: commit.subject }))
          setRebaseDialog({ open: true, loading: false, steps, base, error: null })
        } catch (error) {
          setRebaseDialog({ open: true, loading: false, steps: [], base: null, error })
        }
      }, [rpc, t])

      const applyRebase = React.useCallback(async (base, steps) => {
        try {
          return await perform('rebaseApply', { base, steps }, {
            scope: 'all',
            busyKey: 'rebaseApply',
            success: t('Updated'),
            silent: true,
          })
        } catch (error) {
          await refreshAll(true)
          throw error
        }
      }, [perform, refreshAll, t])

      const resolveConflict = React.useCallback(async (file, side) => {
        try {
          await perform('resolveConflict', { file, side }, {
            scope: 'status',
            busyKey: 'resolveConflict',
            success: `${t(side === 'ours' ? 'Accept ours' : 'Accept theirs')}: ${file}`,
          })
        } catch {
          /* reported by perform */
        }
      }, [perform, t])

      const stageHunks = React.useCallback(async (file, mode, hunks) => {
        const current = repoRef.current
        if (!current || !hunks?.length) return null
        setBusy('stageHunks')
        try {
          const value = await rpc('stageHunks', {
            repo: current.root,
            file,
            mode,
            hunks,
            ignoreWhitespace: ignoreWs,
            context: diffContext,
          }, { timeout: 30_000 })
          await refreshStatus(true)
          setDiffVersion((version) => version + 1)
          notify('success', mode === 'unstage' ? t('Hunks unstaged') : t('Hunks staged'))
          return value
        } catch (error) {
          notify('error', error.message || t('Unknown error'))
          return null
        } finally {
          setBusy(null)
        }
      }, [diffContext, ignoreWs, notify, refreshStatus, rpc, t])

      const createTag = React.useCallback(async (tagName, message, ref) => {
        try {
          return await perform('tagCreate', { name: tagName, message, ref }, {
            scope: 'all',
            busyKey: 'tagCreate',
            success: t('Tag created'),
          })
        } catch {
          return null
        }
      }, [perform, t])

      const confirmDropStash = React.useCallback((stash) => {
        setConfirm({
          title: t('Drop stash'),
          message: `stash@{${stash.index}} · ${stash.subject}\n\n${t('This action cannot be undone.')}`,
          confirmText: t('Drop'),
          danger: true,
          run: async () => {
            await perform('stashDrop', { index: stash.index }, { scope: 'all', busyKey: 'stashDrop', silent: true })
          },
        })
      }, [perform, t])

      const abortOperation = React.useCallback(async () => {
        try {
          await perform('abort', {}, { scope: 'all', busyKey: 'abort', success: t('Updated') })
        } catch {
          /* reported by perform */
        }
      }, [perform, t])

      const continueOperation = React.useCallback(async () => {
        try {
          await perform('continue', {}, { scope: 'all', busyKey: 'continue', success: t('Updated') })
        } catch {
          /* reported by perform */
        }
      }, [perform, t])

      const openCommitMenu = React.useCallback((event, commit) => {
        event.preventDefault()
        event.stopPropagation()
        const firstFile = detail?.commit?.hash === commit.hash ? detail?.files?.[0] : null
        setMenu({
          x: event.clientX,
          y: event.clientY,
          items: [
            { label: t('Show details'), icon: 'commit', onClick: () => selectCommit(commit.hash) },
            { label: t('Open diff'), icon: 'diff', disabled: !firstFile, onClick: () => {
              if (firstFile) openDiff({ kind: 'commit', hash: commit.hash, file: firstFile.path, oldPath: firstFile.oldPath, status: firstFile.status, additions: firstFile.additions, deletions: firstFile.deletions, binary: firstFile.binary })
            } },
            { label: t('Copy hash'), icon: 'copy', onClick: () => copyText(commit.hash, commit.hash) },
            { label: t('Copy location'), icon: 'pin', onClick: () => {
              const text = locationText(commit.hash, null, null)
              copyText(text, text)
            } },
            { label: t('Copy subject'), icon: 'copy', onClick: () => copyText(commit.subject, commit.subject) },
            wbRemote(commit.hash, repoRef.current),
            { type: 'separator' },
            { label: t('Create branch here…'), icon: 'branch', onClick: () => setBranchDialog({ open: true, startPoint: commit.hash }) },
            { label: t('Checkout revision'), icon: 'arrowRight', onClick: () => setConfirm({
              title: t('Checkout revision'),
              message: `${shortHash(commit.hash)}\n\n${t('This action cannot be undone.')}`,
              confirmText: t('Checkout'),
              danger: true,
              run: async () => {
                await perform('checkout', { ref: commit.hash }, { scope: 'all', busyKey: 'checkout', silent: true })
              },
            }) },
            { label: t('Cherry-pick'), icon: 'commit', onClick: () => cherryPick(commit.hash) },
            { label: t('Revert'), icon: 'undo', onClick: () => revertCommit(commit.hash) },
            { label: t('New tag…'), icon: 'tag', onClick: () => setTagDialog({ open: true, ref: commit.hash }) },
            { label: t('Reset…'), icon: 'refresh', danger: true, onClick: () => setResetDialog({ open: true, ref: commit.hash }) },
          ].filter(Boolean),
        })
      }, [cherryPick, copyText, detail, openDiff, perform, revertCommit, selectCommit, t])

      function wbRemote(hash, currentRepo) {
        if (!currentRepo?.remoteUrl) return null
        return { label: t('Open on remote'), icon: 'external', onClick: () => openRemote(hash) }
      }

      const openRefMenu = React.useCallback((event, entry) => {
        event.preventDefault()
        event.stopPropagation()
        const current = entry.head || entry.name === refs.current
        setMenu({
          x: event.clientX,
          y: event.clientY,
          items: [
            { label: t('Checkout'), icon: 'arrowRight', onClick: () => checkoutRef(entry.name) },
            { label: t('Compare with current'), icon: 'diff', disabled: current, onClick: () => openCompare(entry.name) },
            { label: t('Merge into current'), icon: 'git', disabled: current, onClick: () => mergeRef(entry.name) },
            { label: t('Rebase current onto'), icon: 'commit', disabled: current, onClick: () => rebaseRef(entry.name) },
            { type: 'separator' },
            { label: t('New branch from here…'), icon: 'branch', onClick: () => setBranchDialog({ open: true, startPoint: entry.name }) },
            { label: t('New tag from here…'), icon: 'tag', onClick: () => setTagDialog({ open: true, ref: entry.name }) },
            entry.kind === 'local' && !current ? { label: t('Delete branch'), icon: 'trash', danger: true, onClick: () => deleteBranch(entry) } : null,
            { type: 'separator' },
            { label: t('Copy name'), icon: 'copy', onClick: () => copyText(entry.name, entry.name) },
            { label: t('Copy hash'), icon: 'copy', onClick: () => copyText(entry.hash, entry.hash) },
          ].filter(Boolean),
        })
      }, [checkoutRef, copyText, deleteBranch, mergeRef, openCompare, rebaseRef, refs.current, t])

      const graph = React.useMemo(() => buildGraph(commits), [commits])
      const activeView = !repo ? h(NoRepo)
        : tab === 'log' ? h(LogTab)
        : tab === 'changes' ? h(LocalChanges)
        : tab === 'history' ? h(FileHistoryTab)
        : tab === 'blame' ? h(BlameTab)
        : tab === 'stash' ? h(StashTab)
        : h(ConsoleTab)

      const wb = {
        boot, repo, refs, commits, graph, logLoading, logLoadingMore, logError, hasMore,
        selectedHash, detail, detailLoading, detailError, status, refreshingStatus,
        stashes, stashesLoading, filesData, filesLoading, historyFile, historyData, historyLoading, historyError,
        blameFile, blameRev, blameData, blameLoading, blameError, blameIgnoreWs,
        diffTarget, diffData, diffLoading, diffError, diffOpen, diffMode, diffContext, ignoreWs,
        showDetails, detailsWidth, tab, filters, busy, refreshing, toasts, menu, popover, confirm,
        branchDialog, pushDialog, resetDialog, stashDialog, tagDialog, compare, rebaseDialog,
        consoleEntries, commitMessage, amend, signoff, selectedChange, lastUpdated, compact,
        setRepo, setRefs, setStatus, setStashes, setFilesData, setHistoryFile, setBlameFile, setBlameRev,
        setBlameIgnoreWs, setDiffTarget, setDiffMode, setIgnoreWs, setDiffContext, setShowDetails, setDetailsWidth,
        setTab, setFilters, setMenu, setPopover, setConfirm, setBranchDialog, setPushDialog,
        setResetDialog, setStashDialog, setTagDialog, setCompare, setRebaseDialog, setCommitMessage, setAmend, setSignoff, setSelectedChange,        setToasts, notify, dismissToast, copyText, loadBootstrap, openRepo, rescan, loadLog, refreshAll,
        refreshStatus, refreshRefs, loadStashes, loadFiles, loadHistory, loadBlame, selectCommit,
        toggleDetails, openDiff, closeDiff, openChangeDiff, openHistoryFor, openBlameFor, openRemote,
        stagePaths, stagePathsAll, unstagePaths, unstageAll, confirmDiscard, commitChanges, checkoutRef,
        createBranch, deleteBranch, mergeRef, rebaseRef, cherryPick, revertCommit, doReset, fetch: fetchRemote,
        pull: pullRemote, pushRemote, createStash, stashAction, confirmDropStash, abortOperation,
        continueOperation, openCommitMenu, openRefMenu, openCompare, closeCompare, createTag, openRebase, applyRebase, resolveConflict, stageHunks, clearConsole: () => setConsoleEntries([]),
      }

      return h(WorkbenchContext.Provider, { value: wb },
        h('div', {
          ref: rootRef,
          className: cx('ig-root', compact && 'ig-compact'),
          onKeyDown: (event) => {
            if (event.key === 'F5') {
              event.preventDefault()
              refreshAll(false)
            }
          },
        },
        h('style', null, CSS),
        h(Header),
        h(OperationBanner),
        repo ? h(TabBar) : null,
        h('div', { className: 'ig-content' }, activeView, h(DiffOverlay)),
        h(StatusBar),
        h(ConfirmDialog),
        h(BranchDialog),
        h(PushDialog),
        h(ResetDialog),
        h(StashDialog),
        h(TagDialog),
        h(CompareDialog),
        h(RebaseDialog),
        h(RepoPopover),
        h(BranchPopover),
        h(Menu, { menu, onClose: () => setMenu(null) }),
        h('div', { className: 'ig-toasts' }, toasts.map((toast) => h(Toast, { key: toast.id, toast, onDismiss: dismissToast }))))
      )
    }

    /* ------------------------------------------------------------------ *
     * Root, error boundary, registration
     * ------------------------------------------------------------------ */
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props)
        this.state = { error: null }
      }
      static getDerivedStateFromError(error) {
        return { error }
      }
      componentDidCatch(error, info) {
        if (typeof console !== 'undefined') console.error('[idea-git] workbench crashed', error, info)
      }
      render() {
        if (!this.state.error) return this.props.children
        return h('div', { className: 'ig-root' },
          h('style', null, CSS),
          h('div', { className: 'ig-empty' },
            h('div', { className: 'ig-empty-icon' }, h(Icon, { name: 'error', size: 20 })),
            h('div', { className: 'ig-empty-title' }, 'Git panel error'),
            h('div', { className: 'ig-empty-text' }, String(this.state.error?.message || this.state.error)),
            h('div', { className: 'ig-hint' }, 'Reload the page to retry.')))
      }
    }

    function WorkbenchRoot() {
      const [revision, setRevision] = React.useState(0)
      React.useEffect(() => {
        if (!localeService) return undefined
        return localeService.subscribe(() => setRevision((value) => value + 1))
      }, [])
      const t = React.useMemo(() => (localeService ? localeService.bind(NS) : fallbackTranslate), [revision])
      return h(LocaleContext.Provider, { value: t }, h(ErrorBoundary, null, h(App)))
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        localeService = ctx.locale || ctx.get?.('locale') || null
        boundTranslate = localeService ? localeService.bind(NS) : fallbackTranslate
        if (localeService) {
          ctx.effect(() => localeService.register(NS, 'en', EN), 'idea-git: en dictionary')
          ctx.effect(() => localeService.register(NS, 'zh', ZH), 'idea-git: zh dictionary')
        }
        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: 'git',
          order: 30,
          label: () => (boundTranslate || fallbackTranslate)('Git'),
        }, SidebarIcon))
        ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: 'git',
        }, WorkbenchRoot))
      },
    }
  },
});
