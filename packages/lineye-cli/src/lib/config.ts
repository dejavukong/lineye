import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const CONFIG_DIR = path.join(os.homedir(), '.config', 'lineye');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');

export interface WorkspaceConfig {
  name: string;
  apiKey: string;
  defaultTeamId: string;
  defaultTeamKey: string;
  defaultProjectId: string | null;
}

export interface LineyeConfig {
  defaultWorkspace: string;
  workspaces: Record<string, WorkspaceConfig>;
}

export async function getConfigPath(): Promise<string> {
  return CONFIG_PATH;
}

export async function configExists(): Promise<boolean> {
  try {
    await fs.access(CONFIG_PATH);
    return true;
  } catch {
    return false;
  }
}

export async function getConfig(): Promise<LineyeConfig> {
  try {
    const content = await fs.readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(content);
  } catch {
    throw new Error('Lineye not configured. Please run: lineye init');
  }
}

export async function saveConfig(config: LineyeConfig): Promise<void> {
  await fs.mkdir(CONFIG_DIR, { recursive: true });
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export async function getWorkspace(alias?: string): Promise<WorkspaceConfig & { alias: string }> {
  const config = await getConfig();
  const key = alias || config.defaultWorkspace;

  if (!config.workspaces[key]) {
    throw new Error(`Workspace "${key}" does not exist`);
  }

  return { ...config.workspaces[key], alias: key };
}

export async function listWorkspaces(): Promise<
  Array<{
    alias: string;
    name: string;
    isDefault: boolean;
  }>
> {
  const config = await getConfig();

  return Object.entries(config.workspaces).map(([alias, ws]) => ({
    alias,
    name: ws.name,
    isDefault: alias === config.defaultWorkspace,
  }));
}

export async function setDefaultWorkspace(alias: string): Promise<void> {
  const config = await getConfig();

  if (!config.workspaces[alias]) {
    throw new Error(`Workspace "${alias}" does not exist`);
  }

  config.defaultWorkspace = alias;
  await saveConfig(config);
}

export async function addWorkspace(
  alias: string,
  workspace: WorkspaceConfig,
  setAsDefault = false
): Promise<void> {
  let config: LineyeConfig;

  try {
    config = await getConfig();
  } catch {
    config = { defaultWorkspace: alias, workspaces: {} };
  }

  config.workspaces[alias] = workspace;

  if (setAsDefault || Object.keys(config.workspaces).length === 1) {
    config.defaultWorkspace = alias;
  }

  await saveConfig(config);
}

export async function removeWorkspace(alias: string): Promise<void> {
  const config = await getConfig();

  if (!config.workspaces[alias]) {
    throw new Error(`Workspace "${alias}" does not exist`);
  }

  delete config.workspaces[alias];

  if (config.defaultWorkspace === alias) {
    const remaining = Object.keys(config.workspaces);
    config.defaultWorkspace = remaining[0] || '';
  }

  await saveConfig(config);
}
