---
name: lineye:start
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

Ask for branch type:

```
Branch type:
  1. feat (new feature)
  2. fix (bug fix)
  3. refactor (refactoring)
  4. chore (maintenance)
>
```

Generate slug suggestion from title, let user confirm or modify:

```
Branch name suffix [user-feedback]:
```

Execute creation:

```bash
lineye create-branch --issue ENG-128 --type feat --slug user-feedback
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

```
⚠️ Branch feat/ENG-128-user-feedback already exists

Choose action:
  1. Switch to that branch and continue development
  2. Create new branch (add suffix)
  3. Cancel
>
```

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
