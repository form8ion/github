import {promises as fs} from 'node:fs';
import {scaffold as scaffoldSettings} from '@form8ion/repository-settings';

import {constants} from './prompt/index.js';
import {scaffold as scaffoldRepository} from './repository/index.js';

async function promptForOwner(prompt) {
  const promptId = constants.ids.GITHUB_DETAILS;
  const githubAccountQuestionName = constants.questionNames[promptId].GITHUB_ACCOUNT;

  const {[githubAccountQuestionName]: owner} = await prompt({
    id: promptId,
    questions: [{
      name: githubAccountQuestionName,
      message: 'Which GitHub account should the repository be hosted within?'
    }]
  });

  return owner;
}

export default async function scaffoldGithub(
  {projectName, visibility, description, projectRoot},
  {prompt, octokit, logger}
) {
  logger.info('Initializing GitHub');

  const [owner] = await Promise.all([
    promptForOwner(prompt),
    fs.mkdir(`${projectRoot}/.github`, {recursive: true})
  ]);

  try {
    const repositoryResult = await scaffoldRepository({octokit, logger, name: projectName, owner, visibility});
    await scaffoldSettings({projectRoot, projectName, visibility, description}, {logger});

    return repositoryResult;
  } catch (e) {
    logger.error(e.message);

    throw e;
  }
}
