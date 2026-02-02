# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

Lineye - AI-powered task management CLI for Linear. Turn ideas into Linear issues, let Linear + GitHub auto-manage progress.

## Common Commands

```bash
# Development
pnpm dev                    # Watch mode
pnpm build                  # Build CLI
pnpm clean                  # Clean node_modules, dist, .turbo

# Code Quality
pnpm lint                   # ESLint check
pnpm lint:fix               # ESLint auto-fix
pnpm format                 # Prettier format
pnpm type-check             # TypeScript check

# Run CLI locally
pnpm lineye                 # Run built CLI
pnpm lineye init            # Initialize config
pnpm lineye --help          # Show help
```

## Project Structure

```
lineye/
├── .claude-plugin/           # Claude Code Plugin marketplace config
│   ├── plugin.json
│   └── marketplace.json
├── skills/                   # Claude Code skills (root level)
│   ├── lineye-create/
│   └── lineye-start/
├── packages/
│   ├── lineye-cli/           # Main CLI package (npm)
│   │   ├── src/
│   │   │   ├── commands/     # CLI commands
│   │   │   ├── lib/          # Core utilities
│   │   │   └── index.ts      # Entry point
│   │   └── package.json
│   ├── eslint-config/        # Shared ESLint config
│   └── typescript-config/    # Shared TypeScript config
└── package.json
```

## Key Files

| File | Purpose |
|------|---------|
| `packages/lineye-cli/src/index.ts` | CLI entry point |
| `packages/lineye-cli/src/commands/*.ts` | CLI commands |
| `packages/lineye-cli/src/lib/config.ts` | Config management |
| `packages/lineye-cli/src/lib/linear.ts` | Linear API integration |
| `packages/lineye-cli/src/lib/git.ts` | Git operations |
| `skills/*/SKILL.md` | Claude Code skill definitions |

## Adding New CLI Commands

1. Create command file in `packages/lineye-cli/src/commands/`
2. Register in `packages/lineye-cli/src/index.ts`
3. Build and test: `pnpm build && pnpm lineye <command>`

## Config Location

User config stored at `~/.config/lineye/config.json`
