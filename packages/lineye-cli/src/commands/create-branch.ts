import {
  createBranch,
  generateSlug,
  getIssue,
  detectWorkspace,
  isGitRepo,
  type BranchType,
} from '../lib/index';

interface CreateBranchOptions {
  issue: string;
  type: BranchType;
  slug?: string;
  workspace?: string;
}

export async function createBranchCommand(options: CreateBranchOptions) {
  try {
    // Check if we're in a git repo
    if (!isGitRepo()) {
      console.log(
        JSON.stringify({
          success: false,
          error: 'Not a Git repository',
        })
      );
      process.exit(1);
    }

    // Auto-detect workspace from issue prefix if not specified
    let workspace = options.workspace;
    if (!workspace) {
      workspace = (await detectWorkspace(options.issue)) ?? undefined;
    }

    // Get issue info for slug generation
    const issue = await getIssue(options.issue, workspace);
    const slug = options.slug || generateSlug(issue.title);

    const result = createBranch({
      issueId: issue.identifier,
      type: options.type,
      slug,
    });

    if (result.exists) {
      console.log(
        JSON.stringify({
          success: false,
          error: 'branch_exists',
          branch: result.branchName,
        })
      );
      process.exit(1);
    }

    console.log(
      JSON.stringify({
        success: true,
        branch: result.branchName,
        switched: result.switched,
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
