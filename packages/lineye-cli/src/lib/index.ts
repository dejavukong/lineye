// Config
export {
  type LineyeConfig,
  type WorkspaceConfig,
  getConfig,
  saveConfig,
  configExists,
  getConfigPath,
  getWorkspace,
  listWorkspaces,
  setDefaultWorkspace,
  addWorkspace,
  removeWorkspace,
} from './config';

// Linear
export {
  type Team,
  type Project,
  type Issue,
  type CreateIssueParams,
  type CreateIssueResult,
  getLinearClient,
  getTeams,
  getProjects,
  getIssue,
  createIssue,
  parseIssueIdentifier,
  detectWorkspace,
  verifyApiKey,
} from './linear';

// Git
export {
  type BranchType,
  type CreateBranchParams,
  type CreateBranchResult,
  isGitRepo,
  getCurrentBranch,
  branchExists,
  createBranch,
  switchBranch,
  generateSlug,
  getDefaultBranch,
  hasUncommittedChanges,
} from './git';
