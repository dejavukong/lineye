---
name: create
description: Create Linear issue + GitHub issue using brainstorming mode
user-invocable: true
---

## Pre-checks

### 1. Check Lineye Configuration

```bash
lineye workspace current
```

If it fails, prompt user:

```
❌ Lineye not configured

Please run: lineye init
```

### 2. Check superpowers:brainstorming

```bash
ls ~/.claude/skills/superpowers*/brainstorming 2>/dev/null
```

- **If installed**: Invoke `superpowers:brainstorming` skill
- **If not installed**: Use the embedded brainstorming flow below

---

## Embedded Brainstorming Flow

> If superpowers:brainstorming is installed, skip this section and use it directly

### Understanding the Idea

Understand the user's idea through conversation:

- **Ask one question at a time**
- **Prefer multiple choice questions**, open-ended is also fine
- **Focus on key questions**:
  - Who is this feature for?
  - What problem does it solve?
  - What are the scope boundaries?
  - Any special requirements?

### Exploring Options

If there are multiple implementation approaches:
- Propose 2-3 options
- Include recommendation with reasoning
- Let user choose

### Output Requirements

Use minimal format, within 200-300 words:

```markdown
## Background
[One sentence describing the problem to solve]

## Requirements
- [Point 1]
- [Point 2]
- [Point 3]
```

---

## Create Task

After requirements are confirmed, execute these steps:

### 1. Get Teams List

```bash
lineye list-teams --json
```

### 2. Let User Select Team

```
Team:
  1. Engineering (ENG) ← default
  2. Design (DES)
  3. Marketing (MKT)
>
```

### 3. Get Projects List (Optional)

```bash
lineye list-projects --team <selected-team-id> --json
```

### 4. Let User Select Project

```
Associate with Project?
  1. Q1-Launch
  2. Mobile-App
  3. No association
>
```

### 5. Create Issue

```bash
lineye create-issue \
  --title "Issue title" \
  --body "Requirements document content" \
  --team <team-id> \
  --project <project-id>
```

### 6. Output Result

```
✅ Linear: ENG-XXX
✅ GitHub: Auto-synced

📋 Start development:
   git checkout -b feat/ENG-XXX-slug

🔗 Linear: https://linear.app/...
```

---

## Follow-up

Ask the user:

```
Want to start implementing now?
- Enter y or "start" → Invoke /lineye:start ENG-XXX
- Enter n or "later" → End
```
