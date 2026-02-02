import { execFileSync } from 'node:child_process';

export type BranchType = 'feat' | 'fix' | 'refactor' | 'chore';

export interface CreateBranchParams {
  issueId: string;
  type: BranchType;
  slug: string;
}

export interface CreateBranchResult {
  branchName: string;
  exists: boolean;
  switched: boolean;
}

function git(...args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf-8' }).trim();
}

function gitSafe(...args: string[]): string | null {
  try {
    return git(...args);
  } catch {
    return null;
  }
}

export function isGitRepo(): boolean {
  return gitSafe('rev-parse', '--git-dir') !== null;
}

export function getCurrentBranch(): string {
  return git('branch', '--show-current');
}

export function branchExists(name: string): boolean {
  return gitSafe('rev-parse', '--verify', name) !== null;
}

export function createBranch(params: CreateBranchParams): CreateBranchResult {
  const branchName = `${params.type}/${params.issueId}-${params.slug}`;

  if (branchExists(branchName)) {
    return { branchName, exists: true, switched: false };
  }

  git('checkout', '-b', branchName);

  return { branchName, exists: false, switched: true };
}

export function switchBranch(name: string): void {
  git('checkout', name);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-') // Replace non-alphanumeric (keep Chinese) with dash
    .replace(/^-|-$/g, '') // Remove leading/trailing dashes
    .slice(0, 30); // Limit length
}

export function getDefaultBranch(): string {
  // Try to get the default branch from remote
  const result = gitSafe('symbolic-ref', 'refs/remotes/origin/HEAD');
  if (result) {
    return result.replace('refs/remotes/origin/', '');
  }

  // Fallback to common default branch names
  if (branchExists('main')) return 'main';
  if (branchExists('master')) return 'master';
  return 'main';
}

export function hasUncommittedChanges(): boolean {
  const status = gitSafe('status', '--porcelain');
  return status !== null && status.length > 0;
}
