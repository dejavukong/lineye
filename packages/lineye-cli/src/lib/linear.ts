import { LinearClient } from '@linear/sdk';
import { getConfig, getWorkspace } from './config';

export interface Team {
  id: string;
  name: string;
  key: string;
}

export interface Project {
  id: string;
  name: string;
  state: string;
}

export interface Issue {
  id: string;
  identifier: string;
  title: string;
  description: string | null;
  status: string | null;
  url: string;
  branchName: string;
  githubIssue: {
    number: number;
    url: string;
  } | null;
}

export interface CreateIssueParams {
  title: string;
  body: string;
  teamId?: string;
  projectId?: string;
  workspace?: string;
}

export interface CreateIssueResult {
  id: string;
  identifier: string;
  title: string;
  url: string;
  branchName: string;
}

export async function getLinearClient(workspaceAlias?: string): Promise<LinearClient> {
  const workspace = await getWorkspace(workspaceAlias);
  return new LinearClient({ apiKey: workspace.apiKey });
}

export async function getTeams(workspaceAlias?: string): Promise<Team[]> {
  const client = await getLinearClient(workspaceAlias);
  const teams = await client.teams();

  return teams.nodes.map((t) => ({
    id: t.id,
    name: t.name,
    key: t.key,
  }));
}

export async function getProjects(
  workspaceAlias?: string,
  teamId?: string
): Promise<Project[]> {
  const client = await getLinearClient(workspaceAlias);

  if (teamId) {
    const team = await client.team(teamId);
    const projects = await team.projects();
    return projects.nodes.map((p) => ({
      id: p.id,
      name: p.name,
      state: p.state,
    }));
  }

  const projects = await client.projects();
  return projects.nodes.map((p) => ({
    id: p.id,
    name: p.name,
    state: p.state,
  }));
}

export async function getIssue(
  issueId: string,
  workspaceAlias?: string
): Promise<Issue> {
  const client = await getLinearClient(workspaceAlias);
  const identifier = await parseIssueIdentifier(issueId, workspaceAlias);

  const issue = await client.issue(identifier);
  const state = await issue.state;
  const attachments = await issue.attachments();

  // Find GitHub issue attachment
  let githubIssue: Issue['githubIssue'] = null;
  for (const attachment of attachments.nodes) {
    if (attachment.url?.includes('github.com') && attachment.url.includes('/issues/')) {
      const match = attachment.url.match(/\/issues\/(\d+)/);
      if (match) {
        githubIssue = {
          number: parseInt(match[1], 10),
          url: attachment.url,
        };
        break;
      }
    }
  }

  return {
    id: issue.id,
    identifier: issue.identifier,
    title: issue.title,
    description: issue.description ?? null,
    status: state?.name ?? null,
    url: issue.url,
    branchName: issue.branchName,
    githubIssue,
  };
}

export async function createIssue(params: CreateIssueParams): Promise<CreateIssueResult> {
  const workspace = await getWorkspace(params.workspace);
  const client = await getLinearClient(params.workspace);

  const issuePayload = await client.createIssue({
    teamId: params.teamId || workspace.defaultTeamId,
    title: params.title,
    description: params.body,
    projectId: params.projectId || workspace.defaultProjectId || undefined,
  });

  const issue = await issuePayload.issue;

  if (!issue) {
    throw new Error('Failed to create issue');
  }

  return {
    id: issue.id,
    identifier: issue.identifier,
    title: issue.title,
    url: issue.url,
    branchName: issue.branchName,
  };
}

/**
 * Extract issue identifier from various input formats
 * Supports: ENG-123, 123, https://linear.app/workspace/issue/ENG-123/title
 */
export function extractIssueIdFromUrl(input: string): string | null {
  // URL format: https://linear.app/workspace/issue/ENG-123 or https://linear.app/issue/ENG-123
  if (input.includes('linear.app')) {
    const match = input.match(/issue\/([A-Z]+-\d+)/i);
    if (match) return match[1].toUpperCase();
  }
  return null;
}

export async function parseIssueIdentifier(
  input: string,
  workspaceAlias?: string
): Promise<string> {
  // Try URL extraction first
  const fromUrl = extractIssueIdFromUrl(input);
  if (fromUrl) return fromUrl;

  // GitHub URL format: try to detect from linked issue
  if (input.includes('github.com')) {
    throw new Error('GitHub URL parsing not supported. Please use Linear issue ID.');
  }

  // Pure number: add default team prefix
  if (/^\d+$/.test(input)) {
    const workspace = await getWorkspace(workspaceAlias);
    return `${workspace.defaultTeamKey}-${input}`;
  }

  // Already full format: ENG-123
  return input.toUpperCase();
}

export async function detectWorkspace(issueId: string): Promise<string | null> {
  const config = await getConfig();

  // Extract issue ID from URL if needed
  const identifier = extractIssueIdFromUrl(issueId) ?? issueId;
  const prefix = identifier.split('-')[0].toUpperCase();

  for (const [alias, ws] of Object.entries(config.workspaces)) {
    if (ws.defaultTeamKey === prefix) {
      return alias;
    }
  }

  return null;
}

export async function verifyApiKey(apiKey: string): Promise<{
  valid: boolean;
  workspaceName?: string;
  teams?: Team[];
}> {
  try {
    const client = new LinearClient({ apiKey });
    const viewer = await client.viewer;
    const org = await viewer.organization;
    const teams = await client.teams();

    return {
      valid: true,
      workspaceName: org.name,
      teams: teams.nodes.map((t) => ({
        id: t.id,
        name: t.name,
        key: t.key,
      })),
    };
  } catch {
    return { valid: false };
  }
}
