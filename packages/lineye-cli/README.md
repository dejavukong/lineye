# lineye-cli

AI-powered task management CLI for Linear.

## Install

```bash
npm install -g lineye-cli
```

## Quick Start

```bash
# Initialize
lineye init

# Create issue
lineye create-issue --title "Feature" --body "Description"

# Create branch for issue
lineye create-branch --issue ENG-123 --type feat
```

## Commands

| Command | Description |
|---------|-------------|
| `lineye init` | Initialize configuration |
| `lineye workspace list` | List workspaces |
| `lineye workspace use <alias>` | Switch workspace |
| `lineye list-teams` | List teams |
| `lineye list-projects` | List projects |
| `lineye show <issue-id>` | Show issue details |
| `lineye create-issue` | Create Linear issue |
| `lineye create-branch` | Create git branch |

## Claude Code Skills

Install skills for AI-driven workflow:

```
/plugin marketplace add dejavukong/lineye
/plugin install lineye@lineye
```

Then use:
- `/lineye:create` - Brainstorm → Create issue
- `/lineye:start <id>` - Load task → Create branch

## More

See [GitHub](https://github.com/dejavukong/lineye) for full documentation.

## License

MIT
