import {promises as fs} from 'node:fs';

import {scaffold as scaffoldSettings} from './settings/index.js';
import {scaffold as scaffoldRepository} from './repository/index.js';
import promptForRepositoryOwner from './repository/prompt.js';

export default async function scaffoldGithub(
  {projectName, visibility, description, projectRoot},
  {prompt, octokit, logger}
) {
  if (!octokit) {
    logger.error('Repository cannot be created without a proper GitHub Personal Access Token!');

    return {};
  }

  logger.info('Initializing GitHub');

  const account = await promptForRepositoryOwner({prompt, octokit});

  await fs.mkdir(`${projectRoot}/.github`, {recursive: true});

  try {
    const repositoryResult = await scaffoldRepository({name: projectName, visibility, account}, {octokit, logger});
    await scaffoldSettings({projectRoot, projectName, visibility, description}, {logger, prompt});

    return repositoryResult;
  } catch (e) {
    logger.error(e.message);

    throw e;
  }
}
