import * as p from '@clack/prompts';
import {
  addWorkspace,
  configExists,
  listWorkspaces,
  verifyApiKey,
} from '../lib/index';

export async function init() {
  p.intro('🚀 Lineye Setup');

  // Check existing config
  const hasConfig = await configExists();

  if (hasConfig) {
    const workspaces = await listWorkspaces();
    p.note(
      workspaces
        .map((w) => `• ${w.alias} (${w.name})${w.isDefault ? ' - default' : ''}`)
        .join('\n'),
      'Existing configuration detected'
    );

    const action = await p.select({
      message: 'Select action',
      options: [
        { value: 'add', label: 'Add new Workspace' },
        { value: 'cancel', label: 'Cancel' },
      ],
    });

    if (p.isCancel(action) || action === 'cancel') {
      p.cancel('Cancelled');
      process.exit(0);
    }
  }

  // Get API Key first
  p.note(
    'Open https://linear.app/settings/account/security\nClick "New API Key" to create one',
    '💡 How to get API Key'
  );

  const apiKey = await p.text({
    message: 'Linear API Key',
    placeholder: 'lin_api_xxxxx',
    validate: (value) => {
      if (!value) return 'Please enter API Key';
      if (!value.startsWith('lin_api_')) return 'Invalid API Key format';
      return undefined;
    },
  });

  if (p.isCancel(apiKey)) {
    p.cancel('Cancelled');
    process.exit(0);
  }

  // Verify API Key
  const spin = p.spinner();
  spin.start('Verifying API Key...');

  const verification = await verifyApiKey(apiKey);

  if (!verification.valid) {
    spin.stop('❌ Invalid API Key');
    process.exit(1);
  }

  spin.stop(`✅ Connected to: ${verification.workspaceName}`);

  // Generate suggested alias from workspace name
  const suggestedAlias = verification.workspaceName!
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 20);

  // Get workspace alias (now user knows the workspace name)
  const alias = await p.text({
    message: `Alias for "${verification.workspaceName}" (for quick switching)`,
    placeholder: suggestedAlias || 'work',
    defaultValue: suggestedAlias,
    validate: (value) => {
      if (!value) return 'Please enter an alias';
      if (!/^[a-z0-9-]+$/.test(value)) return 'Only lowercase letters, numbers, and hyphens allowed';
      return undefined;
    },
  });

  if (p.isCancel(alias)) {
    p.cancel('Cancelled');
    process.exit(0);
  }

  // Select default team
  const teamOptions = verification.teams!.map((t) => ({
    value: t.id,
    label: `${t.name} (${t.key})`,
    key: t.key,
  }));

  const selectedTeamId = await p.select({
    message: 'Select default Team',
    options: teamOptions,
  });

  if (p.isCancel(selectedTeamId)) {
    p.cancel('Cancelled');
    process.exit(0);
  }

  const selectedTeam = teamOptions.find((t) => t.value === selectedTeamId)!;

  // Ask if set as default
  let setAsDefault = !hasConfig;
  if (hasConfig) {
    const makeDefault = await p.confirm({
      message: 'Set as default Workspace?',
      initialValue: false,
    });

    if (!p.isCancel(makeDefault)) {
      setAsDefault = makeDefault;
    }
  }

  // Save config
  await addWorkspace(
    alias,
    {
      name: verification.workspaceName!,
      apiKey,
      defaultTeamId: selectedTeamId as string,
      defaultTeamKey: selectedTeam.key,
      defaultProjectId: null,
    },
    setAsDefault
  );

  p.outro(`
✅ Workspace "${alias}" configured!

Next step - Install Claude Code skills:
  /plugin marketplace add dejavukong/lineye
  /plugin install lineye@lineye

Then you can use:
  /lineye:create "your idea"
  /lineye:start ENG-123
  `);
}
