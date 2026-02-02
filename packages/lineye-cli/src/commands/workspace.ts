import * as p from '@clack/prompts';
import {
  listWorkspaces,
  setDefaultWorkspace,
  getWorkspace,
  removeWorkspace,
} from '../lib/index';

export async function workspaceList() {
  const workspaces = await listWorkspaces();

  if (workspaces.length === 0) {
    console.log('No Workspace configured. Please run: lineye init');
    return;
  }

  for (const ws of workspaces) {
    const marker = ws.isDefault ? '✓ default' : '';
    console.log(`${ws.alias} (${ws.name}) ${marker}`);
  }
}

export async function workspaceUse(alias: string) {
  try {
    await setDefaultWorkspace(alias);
    const ws = await getWorkspace(alias);
    console.log(`✅ Default Workspace switched to: ${alias} (${ws.name})`);
  } catch (error) {
    console.error(`❌ ${(error as Error).message}`);
    process.exit(1);
  }
}

export async function workspaceCurrent() {
  try {
    const ws = await getWorkspace();
    console.log(`${ws.alias} (${ws.name})`);
  } catch (error) {
    console.error(`❌ ${(error as Error).message}`);
    process.exit(1);
  }
}

export async function workspaceRemove(alias: string) {
  try {
    const ws = await getWorkspace(alias);

    const confirmed = await p.confirm({
      message: `Are you sure you want to remove Workspace "${alias}" (${ws.name})?`,
      initialValue: false,
    });

    if (p.isCancel(confirmed) || !confirmed) {
      p.cancel('Cancelled');
      return;
    }

    await removeWorkspace(alias);
    console.log(`✅ Workspace "${alias}" removed`);
  } catch (error) {
    console.error(`❌ ${(error as Error).message}`);
    process.exit(1);
  }
}
