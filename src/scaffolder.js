import {promises as fs} from 'node:fs';
import {info, error} from '@travi/cli-messages';
import {scaffold as scaffoldSettings} from '@form8ion/repository-settings';

import {factory as getAuthenticatedOctokit} from './octokit/factory.js';
import {scaffold as scaffoldRepository} from './repository/index.js';

export default async function ({projectName, owner, visibility, description, projectRoot}) {
  info('Initializing GitHub');

  const octokit = getAuthenticatedOctokit();

  await fs.mkdir(`${projectRoot}/.github`, {recursive: true});

  try {
    const repositoryResult = await scaffoldRepository({octokit, name: projectName, owner, visibility});
    await scaffoldSettings({projectRoot, projectName, visibility, description});

    return repositoryResult;
  } catch (e) {
    error(e.message);

    throw e;
  }
}
