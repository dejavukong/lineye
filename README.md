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

### 2. Install Claude Code Skills

In Claude Code, add the marketplace:

```
/plugin marketplace add dejavukong/lineye
```

Then install:

```
/plugin install lineye@lineye
```

### 3. Initialize

```bash
lineye init
```

Follow prompts to enter:
- Linear API Key ([get here](https://linear.app/settings/account/security))
- Select default Team

## Usage

In Claude Code:

```bash
# Create new task via brainstorming
> /lineye:create I want to add a search feature

# Pick up task and start coding
> /lineye:start ENG-123
```

## CLI Commands

### Config

```bash
lineye init                     # Initialize
lineye workspace list           # List workspaces
lineye workspace use <alias>    # Switch workspace
lineye workspace current        # Show current
```

### Query

```bash
lineye list-teams               # List teams
lineye list-projects            # List projects
lineye show <issue-id>          # Show issue details
```

### Operations

```bash
lineye create-issue --title "Title" --body "Content"
lineye create-branch --issue ENG-123 --type feat
```

## Claude Code Skills

| Skill | Description |
|-------|-------------|
| `/lineye:create` | AI-driven brainstorming → Linear issue |
| `/lineye:start <id>` | Load task context → Create branch → Start coding |

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
