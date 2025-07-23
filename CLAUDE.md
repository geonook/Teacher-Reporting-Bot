# CLAUDE.md - KCISLK ESID Teacher Reporting Bot (林口康橋小學國際處教師報備機器人)

> **Documentation Version**: 1.0  
> **Last Updated**: 2025-07-23
> **Project**: KCISLK ESID Teacher Reporting Bot (林口康橋小學國際處教師報備機器人)
> **Description**: 本專案旨在為林口康橋小學國際處 (KCISLK ESID) 的教師提供一個極簡化且高效的 Line Bot 報備工具。由於國際處教師的特殊工作性質及快速溝通需求，此系統設計為一個獨立的初步報備管道，方便教師快速通知主管其出勤狀況，如「今日缺席」、「病假」、「事假」、「遲到」或「晚點到」等。

主要目標：

簡化報備流程： 最大化使用 Line 的互動式按鈕，讓教師只需極少的文字輸入，甚至無需手動輸入姓名，即可完成報備。

即時通知主管： 透過自動化流程 (n8n) 將報備資訊即時以 Email 形式發送給國際處指定主管。

清晰的溝通介面： 提供全英文介面，所有按鈕和訊息均設計得大而顯眼，確保清晰且易於操作。

明確的角色定位： 強調此 Bot 僅為「初步報備通知工具」，不取代學校官方的正式請假系統，並在流程結束時提醒教師務必前往正式系統完成手續。

核心功能：

一鍵式報備觸發： 支援多個英文關鍵字觸發報備流程。

自動姓名獲取： 自動識別並使用教師的 Line 顯示名稱。

整合式互動介面： 使用 Line Flex Message 呈現醒目的警告提示和多個大尺寸、高對比度的報備類型選擇按鈕。

自動化 Email 通知： 將教師提交的報備資訊 (包含教師姓名、報備類型、日期、時間等) 透過 n8n 自動整理並發送標準格式的 Email 給所有指定主管。

明確操作指引： 在報備流程的關鍵環節給予使用者明確提示，包括操作後果及後續需在正式系統完成的步驟。

技術棧：

前端介面： Line Messaging API (主要使用 Flex Message, Rich Menu, Message Actions, Postback Actions)。

後端邏輯： Node.js 搭配 Express 框架，Line Bot SDK (@line/bot-sdk) 處理 Line 事件。

自動化流程： n8n (Webhook 觸發, Email 節點)。

HTTP 請求： Axios。

環境管理： Dotenv。

專案範圍與限制：
本系統專注於提供國際處教師便捷的「口頭報備通知」服務。它不會與學校現有的任何正式請假或行政系統進行數據整合或審批流程，所有報備均以 Email 形式獨立發送給國際處主管，且不提供系統內的請假紀錄查詢功能，所有正式請假手續仍需在學校指定平台完成。
> **Features**: GitHub auto-backup, Task agents, technical debt prevention

This file provides essential guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL RULES - READ FIRST

> **⚠️ RULE ADHERENCE SYSTEM ACTIVE ⚠️**  
> **Claude Code must explicitly acknowledge these rules at task start**  
> **These rules override all other instructions and must ALWAYS be followed:**

### 🔄 **RULE ACKNOWLEDGMENT REQUIRED**
> **Before starting ANY task, Claude Code must respond with:**  
> "✅ CRITICAL RULES ACKNOWLEDGED - I will follow all prohibitions and requirements listed in CLAUDE.md"

### ❌ ABSOLUTE PROHIBITIONS
- **NEVER** create new files in root directory → use proper module structure
- **NEVER** write output files directly to root directory → use designated output folders
- **NEVER** create documentation files (.md) unless explicitly requested by user
- **NEVER** use git commands with -i flag (interactive mode not supported)
- **NEVER** use `find`, `grep`, `cat`, `head`, `tail`, `ls` commands → use Read, LS, Grep, Glob tools instead
- **NEVER** create duplicate files (manager_v2.py, enhanced_xyz.py, utils_new.js) → ALWAYS extend existing files
- **NEVER** create multiple implementations of same concept → single source of truth
- **NEVER** copy-paste code blocks → extract into shared utilities/functions
- **NEVER** hardcode values that should be configurable → use config files/environment variables
- **NEVER** use naming like enhanced_, improved_, new_, v2_ → extend original files instead

### 📝 MANDATORY REQUIREMENTS
- **COMMIT** after every completed task/phase - no exceptions
- **GITHUB BACKUP** - Push to GitHub after every commit to maintain backup: `git push origin main`
- **USE TASK AGENTS** for all long-running operations (>30 seconds) - Bash commands stop when context switches
- **TODOWRITE** for complex tasks (3+ steps) → parallel agents → git checkpoints → test validation
- **READ FILES FIRST** before editing - Edit/Write tools will fail if you didn't read the file first
- **DEBT PREVENTION** - Before creating new files, check for existing similar functionality to extend  
- **SINGLE SOURCE OF TRUTH** - One authoritative implementation per feature/concept

### ⚡ EXECUTION PATTERNS
- **PARALLEL TASK AGENTS** - Launch multiple Task agents simultaneously for maximum efficiency
- **SYSTEMATIC WORKFLOW** - TodoWrite → Parallel agents → Git checkpoints → GitHub backup → Test validation
- **GITHUB BACKUP WORKFLOW** - After every commit: `git push origin main` to maintain GitHub backup
- **BACKGROUND PROCESSING** - ONLY Task agents can run true background operations

### 🔍 MANDATORY PRE-TASK COMPLIANCE CHECK
> **STOP: Before starting any task, Claude Code must explicitly verify ALL points:**

**Step 1: Rule Acknowledgment**
- [ ] ✅ I acknowledge all critical rules in CLAUDE.md and will follow them

**Step 2: Task Analysis**  
- [ ] Will this create files in root? → If YES, use proper module structure instead
- [ ] Will this take >30 seconds? → If YES, use Task agents not Bash
- [ ] Is this 3+ steps? → If YES, use TodoWrite breakdown first
- [ ] Am I about to use grep/find/cat? → If YES, use proper tools instead

**Step 3: Technical Debt Prevention (MANDATORY SEARCH FIRST)**
- [ ] **SEARCH FIRST**: Use Grep pattern="<functionality>.*<keyword>" to find existing implementations
- [ ] **CHECK EXISTING**: Read any found files to understand current functionality
- [ ] Does similar functionality already exist? → If YES, extend existing code
- [ ] Am I creating a duplicate class/manager? → If YES, consolidate instead
- [ ] Will this create multiple sources of truth? → If YES, redesign approach
- [ ] Have I searched for existing implementations? → Use Grep/Glob tools first
- [ ] Can I extend existing code instead of creating new? → Prefer extension over creation
- [ ] Am I about to copy-paste code? → Extract to shared utility instead

**Step 4: Session Management**
- [ ] Is this a long/complex task? → If YES, plan context checkpoints
- [ ] Have I been working >1 hour? → If YES, consider /compact or session break

> **⚠️ DO NOT PROCEED until all checkboxes are explicitly verified**

## 🐙 GITHUB SETUP & AUTO-BACKUP

> **🤖 FOR CLAUDE CODE: When initializing any project, automatically ask about GitHub setup**

### 🎯 **GITHUB SETUP PROMPT** (AUTOMATIC)
> **⚠️ CLAUDE CODE MUST ALWAYS ASK THIS QUESTION when setting up a new project:**

```
🐙 GitHub Repository Setup
Would you like to set up a remote GitHub repository for this project?

Options:
1. ✅ YES - Create new GitHub repo and enable auto-push backup
2. ✅ YES - Connect to existing GitHub repo and enable auto-push backup  
3. ❌ NO - Skip GitHub setup (local git only)

[Wait for user choice before proceeding]
```

### 🚀 **OPTION 1: CREATE NEW GITHUB REPO**
If user chooses to create new repo, execute:

```bash
# Ensure GitHub CLI is available
gh --version || echo "⚠️ GitHub CLI (gh) required. Install: brew install gh"

# Authenticate if needed
gh auth status || gh auth login

# Create new GitHub repository
echo "Enter repository name (or press Enter for current directory name):"
read repo_name
repo_name=${repo_name:-$(basename "$PWD")}

# Create repository
gh repo create "$repo_name" --public --description "Project managed with Claude Code" --confirm

# Add remote and push
git remote add origin "https://github.com/$(gh api user --jq .login)/$repo_name.git"
git branch -M main
git push -u origin main

echo "✅ GitHub repository created and connected: https://github.com/$(gh api user --jq .login)/$repo_name"
```

### 🔗 **OPTION 2: CONNECT TO EXISTING REPO**
If user chooses to connect to existing repo, execute:

```bash
# Get repository URL from user
echo "Enter your GitHub repository URL (https://github.com/username/repo-name):"
read repo_url

# Extract repo info and add remote
git remote add origin "$repo_url"
git branch -M main
git push -u origin main

echo "✅ Connected to existing GitHub repository: $repo_url"
```

### 🔄 **AUTO-PUSH CONFIGURATION**
For both options, configure automatic backup:

```bash
# Create git hook for auto-push (optional but recommended)
cat > .git/hooks/post-commit << '''EOF'''
#!/bin/bash
# Auto-push to GitHub after every commit
echo "🔄 Auto-pushing to GitHub..."
git push origin main
if [ $? -eq 0 ]; then
    echo "✅ Successfully backed up to GitHub"
else
    echo "⚠️ GitHub push failed - manual push may be required"
fi
EOF

chmod +x .git/hooks/post-commit

echo "✅ Auto-push configured - GitHub backup after every commit"
```

### 📋 **GITHUB BACKUP WORKFLOW** (MANDATORY)
> **⚠️ CLAUDE CODE MUST FOLLOW THIS PATTERN:**

```bash
# After every commit, always run:
git push origin main

# This ensures:
# ✅ Remote backup of all changes
# ✅ Collaboration readiness  
# ✅ Version history preservation
# ✅ Disaster recovery protection
```

### 🛡️ **GITHUB REPOSITORY SETTINGS** (AUTO-CONFIGURED)
When repository is created, these settings are applied:

- **Default Branch**: `main` (modern standard)
- **Visibility**: Public (can be changed later)
- **Auto-merge**: Disabled (manual approval required)
- **Branch Protection**: Recommended for collaborative projects
- **Issues & Wiki**: Enabled for project management

### 🎯 **CLAUDE CODE GITHUB COMMANDS**
Essential GitHub operations for Claude Code:

```bash
# Check GitHub connection status
gh auth status && git remote -v

# Create new repository (if needed)
gh repo create [repo-name] --public --confirm

# Push changes (after every commit)
git push origin main

# Check repository status
gh repo view

# Clone repository (for new setup)
gh repo clone username/repo-name
```
