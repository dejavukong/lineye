# Lineye

AI-powered task management — Turn ideas into Linear issues, let Linear + GitHub auto-manage progress.

## How It Works

```
Vague idea → AI refines through questions → Linear issue → Auto-sync to GitHub
                                                    ↓
              Developer checkout branch → Auto "In Progress"
                                                    ↓
                              PR merged → Auto "Done"
```

**You only need to do one thing: Tell AI your idea, the rest is automatic.**

## Installation

### 1. Install CLI

```bash
npm install -g lineye-cli
```

### 2. Configure Lineye

```bash
lineye init
```

You'll be prompted to:

1. **Enter Linear API Key**
   - Go to https://linear.app/settings/account/security
   - Click "New API Key" and copy it

2. **Verify Connection**
   - Lineye will show your workspace name after verification

3. **Set Workspace Alias**
   - A short name for quick switching (e.g., `work`, `personal`)
   - Suggested alias is auto-generated from workspace name

4. **Select Default Team**
   - Choose which team's issues to manage by default

### 3. Install Claude Code Skills

In Claude Code, add the plugin marketplace:

```
/plugin marketplace add dejavukong/lineye
```

Then install the skills:

```
/plugin install lineye@lineye
```

## Usage Workflow

### Step 1: Create Task (`/lineye:create`)

Have an idea? Let AI help you turn it into a well-defined Linear issue:

```
> /lineye:create I want to add a dark mode feature
```

AI will:
- Ask clarifying questions to understand scope
- Define acceptance criteria
- Create a Linear issue with proper structure
- Optionally sync to GitHub Issues

**Output:** A new Linear issue (e.g., `ENG-123`) with a URL like:
```
https://linear.app/your-team/issue/ENG-123/dark-mode-feature
```

### Step 2: Start Working (`/lineye:start`)

Ready to code? Pick up any task using its ID or URL:

```bash
# Using issue ID
> /lineye:start ENG-123

# Using lowercase
> /lineye:start eng-123

# Using just the number (uses default team prefix)
> /lineye:start 123

# Using Linear URL (copy from browser)
> /lineye:start https://linear.app/your-team/issue/ENG-123/dark-mode-feature
```

AI will:
- Fetch and display task details
- Ask for branch type (feat/fix/refactor/chore)
- Suggest branch name from issue title
- Create and checkout the branch
- Load task context for implementation

**Output:**
```
✅ Branch created: feat/ENG-123-dark-mode-feature
✅ Switched to new branch
📋 Task context loaded

Now you can start implementing!
```

### Step 3: Code & Push

After pushing your branch, Linear automatically updates the issue status to "In Progress".

### Step 4: Merge PR

When your PR is merged, Linear automatically marks the issue as "Done".

## Quick Reference

| Action | Command |
|--------|---------|
| Create new task | `/lineye:create <your idea>` |
| Start working (ID) | `/lineye:start ENG-123` |
| Start working (URL) | `/lineye:start https://linear.app/.../ENG-123/...` |
| Show issue details | `lineye show ENG-123` |
| List your issues | `lineye list` |

## Multiple Workspaces

Managing multiple Linear workspaces?

```bash
# Add another workspace
lineye init

# List all workspaces
lineye workspace list

# Switch default workspace
lineye workspace use personal

# Check current workspace
lineye workspace current
```

## CLI Commands

```bash
# Setup
lineye init                     # Initialize / add workspace
lineye workspace list           # List workspaces
lineye workspace use <alias>    # Switch workspace
lineye workspace current        # Show current

# Query
lineye list                     # List assigned issues
lineye show <issue-id>          # Show issue details
lineye list-teams               # List teams
lineye list-projects            # List projects

# Operations (used by skills internally)
lineye create-issue --title "Title" --body "Content"
lineye create-branch --issue ENG-123 --type feat
```

## Linear + GitHub Integration

Set up [Linear GitHub integration](https://linear.app/docs/github-integration) to enable auto status updates.

**Branch naming:**
```
feat/ENG-123-feature-name
fix/ENG-456-bug-description
```

Linear auto-detects issue ID and updates status.

## Config

Stored at `~/.config/lineye/config.json`:

```json
{
  "defaultWorkspace": "work",
  "workspaces": {
    "work": {
      "name": "Acme Corp",
      "apiKey": "lin_api_xxx",
      "defaultTeamId": "team-123",
      "defaultTeamKey": "ENG"
    }
  }
}
```

## Requirements

- [Linear](https://linear.app) account
- [Claude Code](https://claude.ai/code) (for Skills)
- Node.js >= 20

## License

MIT
