import {promises as fs} from 'node:fs';
import {info, error} from '@travi/cli-messages';
import {scaffold as scaffoldSettings} from '@form8ion/repository-settings';

import {constants} from './prompt/index.js';
import {factory as getAuthenticatedOctokit} from './octokit/factory.js';
import {scaffold as scaffoldRepository} from './repository/index.js';

export default async function ({projectName, visibility, description, projectRoot}, {prompt}) {
  info('Initializing GitHub');

  const octokit = getAuthenticatedOctokit();

  const [{githubAccount: owner}] = await Promise.all([
    prompt({
      questions: [{name: 'githubAccount', message: 'Which GitHub account should the repository be hosted within?'}],
      id: constants.ids.GITHUB_DETAILS
    }),
    fs.mkdir(`${projectRoot}/.github`, {recursive: true})
  ]);

  try {
    const repositoryResult = await scaffoldRepository({octokit, name: projectName, owner, visibility});
    await scaffoldSettings({projectRoot, projectName, visibility, description});

    return repositoryResult;
  } catch (e) {
    error(e.message);

    throw e;
  }
}
