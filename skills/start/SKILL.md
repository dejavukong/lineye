---
name: start
description: Pick up task, load context, create branch
args: <issue-id | url>
---

## Input Parsing

Supports multiple formats:

| Input | Handling |
|-------|----------|
| `ENG-128` | Use directly |
| `eng-128` | Convert to uppercase |
| `128` | Add default Team prefix |
| `https://linear.app/team/issue/ENG-128` | Extract ID |

---

## Flow

### 1. Get Task Details

```bash
lineye show <issue-id> --format json
```

Parse JSON to get:
- `identifier`: Issue ID (ENG-128)
- `title`: Title
- `description`: Requirements content
- `url`: Linear URL
- `githubIssue`: GitHub issue info (if exists)

### 2. Display Task Content

Output task content to conversation context:

```
📋 ENG-128: User Feedback Feature
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Background
Collect user bug reports and feature suggestions

## Requirements
- Entry point: In-app floating feedback button
- Requires user login
- Auto-collect: Current page URL, browser info

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 Linear: https://linear.app/team/issue/ENG-128
🔗 GitHub: https://github.com/org/repo/issues/45
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3. Create Branch

Use `AskUserQuestion` tool to ask for branch details in ONE call with TWO questions:

**Question 1 - Branch type:**
- header: "Branch type"
- question: "What type of branch should I create?"
- options:
  - `feat` - New feature
  - `fix` - Bug fix
  - `refactor` - Code refactoring
  - `chore` - Maintenance task

**Question 2 - Branch name suffix:**
- header: "Branch suffix"
- question: "Branch name suffix? Suggested: `<generated-slug>` (select to use, or choose Other to customize)"
- options:
  - `<generated-slug>` - Use suggested name (generate a kebab-case slug from issue title)
  - `custom` - Enter custom name

**IMPORTANT:** Do NOT use text prompts like "Press Enter to confirm". Always use AskUserQuestion with explicit options.

After getting answers, execute:

```bash
lineye create-branch --issue ENG-128 --type <selected-type> --slug <selected-or-custom-slug>
```

### 4. Output Result

```
✅ Branch created: feat/ENG-128-user-feedback
✅ Switched to new branch
✅ Linear status will auto-update to In Progress (after you push)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Task content loaded to context
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Now you can:
• /superpowers:writing-plans  - Create implementation plan
• /superpowers:tdd            - Test-driven development
• Or just tell me "start implementing"
```

---

## Error Handling

### Issue Not Found

```
❌ Cannot find ENG-999

Possible reasons:
- Issue ID is incorrect
- No permission to access this Team

Please check and try again
```

### Branch Already Exists

Use `AskUserQuestion` tool:
- header: "Branch exists"
- question: "Branch `feat/ENG-128-user-feedback` already exists. What would you like to do?"
- options:
  - `switch` - Switch to existing branch and continue
  - `new` - Create new branch with suffix
  - `cancel` - Cancel operation

### Not in Git Repository

```
❌ Current directory is not a Git repository

Please switch to project directory and try again
```

### Lineye Not Configured

```
❌ Lineye not configured

Please run: lineye init
```
