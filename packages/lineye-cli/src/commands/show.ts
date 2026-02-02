import { getIssue, detectWorkspace } from '../lib/index';

interface ShowOptions {
  workspace?: string;
  format?: 'json' | 'markdown';
}

export async function show(issueId: string, options: ShowOptions) {
  try {
    // Auto-detect workspace from issue prefix if not specified
    let workspace = options.workspace;
    if (!workspace) {
      workspace = (await detectWorkspace(issueId)) ?? undefined;
    }

    const issue = await getIssue(issueId, workspace);

    if (options.format === 'json') {
      console.log(JSON.stringify(issue, null, 2));
      return;
    }

    // Markdown format
    console.log(`
📋 ${issue.identifier}: ${issue.title}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${issue.description || '(No description)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 Linear: ${issue.url}
${issue.githubIssue ? `🔗 GitHub: ${issue.githubIssue.url}` : ''}
    `.trim());
  } catch (error) {
    console.error(`❌ ${(error as Error).message}`);
    process.exit(1);
  }
}
