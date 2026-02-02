#!/usr/bin/env node

import { Command } from 'commander';
import { init } from './commands/init';
import {
  workspaceList,
  workspaceUse,
  workspaceCurrent,
  workspaceRemove,
} from './commands/workspace';
import { listTeams, listProjects } from './commands/list';
import { show } from './commands/show';
import { createIssueCommand } from './commands/create-issue';
import { createBranchCommand } from './commands/create-branch';

const program = new Command();

program
  .name('lineye')
  .description('AI-powered task management - Linear + GitHub automation')
  .version('0.1.0');

// Init command
program.command('init').description('Initialize Lineye configuration').action(init);

// Workspace commands
const workspace = program.command('workspace').description('Manage Workspaces');

workspace
  .command('list')
  .description('List all Workspaces')
  .action(workspaceList);

workspace
  .command('use <alias>')
  .description('Switch default Workspace')
  .action(workspaceUse);

workspace
  .command('current')
  .description('Show current Workspace')
  .action(workspaceCurrent);

workspace
  .command('remove <alias>')
  .description('Remove Workspace')
  .action(workspaceRemove);

// List commands
program
  .command('list-teams')
  .description('List Teams')
  .option('-w, --workspace <alias>', 'Specify Workspace')
  .option('--json', 'Output JSON format')
  .action(listTeams);

program
  .command('list-projects')
  .description('List Projects')
  .option('-w, --workspace <alias>', 'Specify Workspace')
  .option('--team <id>', 'Specify Team')
  .option('--json', 'Output JSON format')
  .action(listProjects);

// Show command
program
  .command('show <issue-id>')
  .description('Show Issue details')
  .option('-w, --workspace <alias>', 'Specify Workspace')
  .option('--format <format>', 'Output format (json|markdown)', 'markdown')
  .action(show);

// Create issue command
program
  .command('create-issue')
  .description('Create Linear Issue')
  .requiredOption('--title <title>', 'Issue title')
  .requiredOption('--body <body>', 'Issue body')
  .option('--team <id>', 'Team ID')
  .option('--project <id>', 'Project ID')
  .option('-w, --workspace <alias>', 'Specify Workspace')
  .action(createIssueCommand);

// Create branch command
program
  .command('create-branch')
  .description('Create development branch')
  .requiredOption('--issue <id>', 'Issue ID')
  .requiredOption('--type <type>', 'Branch type (feat|fix|refactor|chore)')
  .option('--slug <slug>', 'Branch name suffix')
  .option('-w, --workspace <alias>', 'Specify Workspace')
  .action(createBranchCommand);

program.parse();
