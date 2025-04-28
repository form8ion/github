import {promises as fs} from 'node:fs';

import {scaffold as scaffoldSettings} from './settings/index.js';
import promptForRepositoryOwner from './repository/prompt.js';
import {scaffold as scaffoldRepository} from './repository/index.js';

export default async function scaffoldGithub(
  {projectName, visibility, description, projectRoot},
  {prompt, octokit, logger}
) {
  logger.info('Initializing GitHub');

  const [owner] = await Promise.all([
    promptForRepositoryOwner(prompt),
    fs.mkdir(`${projectRoot}/.github`, {recursive: true})
  ]);

  try {
    const repositoryResult = await scaffoldRepository({octokit, logger, name: projectName, owner, visibility});
    await scaffoldSettings({projectRoot, projectName, visibility, description}, {logger, prompt});

    return repositoryResult;
  } catch (e) {
    logger.error(e.message);

    throw e;
  }
}
