import { getTeams, getProjects } from '../lib/index';

interface ListTeamsOptions {
  workspace?: string;
  json?: boolean;
}

interface ListProjectsOptions {
  workspace?: string;
  team?: string;
  json?: boolean;
}

export async function listTeams(options: ListTeamsOptions) {
  try {
    const teams = await getTeams(options.workspace);

    if (options.json) {
      console.log(JSON.stringify(teams, null, 2));
      return;
    }

    if (teams.length === 0) {
      console.log('No Teams found');
      return;
    }

    for (const team of teams) {
      console.log(`${team.key}\t${team.name}\t${team.id}`);
    }
  } catch (error) {
    console.error(`❌ ${(error as Error).message}`);
    process.exit(1);
  }
}

export async function listProjects(options: ListProjectsOptions) {
  try {
    const projects = await getProjects(options.workspace, options.team);

    if (options.json) {
      console.log(JSON.stringify(projects, null, 2));
      return;
    }

    if (projects.length === 0) {
      console.log('No Projects found');
      return;
    }

    for (const project of projects) {
      console.log(`${project.name}\t${project.state}\t${project.id}`);
    }
  } catch (error) {
    console.error(`❌ ${(error as Error).message}`);
    process.exit(1);
  }
}
