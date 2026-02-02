import { createIssue, generateSlug } from '../lib/index';

interface CreateIssueOptions {
  title: string;
  body: string;
  team?: string;
  project?: string;
  workspace?: string;
}

export async function createIssueCommand(options: CreateIssueOptions) {
  try {
    const result = await createIssue({
      title: options.title,
      body: options.body,
      teamId: options.team,
      projectId: options.project,
      workspace: options.workspace,
    });

    const slug = generateSlug(result.title);

    // Output JSON for skill parsing
    console.log(
      JSON.stringify({
        success: true,
        issue: {
          id: result.id,
          identifier: result.identifier,
          title: result.title,
          url: result.url,
          branch: `feat/${result.identifier}-${slug}`,
        },
      })
    );
  } catch (error) {
    console.log(
      JSON.stringify({
        success: false,
        error: (error as Error).message,
      })
    );
    process.exit(1);
  }
}
