import {info} from '@travi/cli-messages';

import {factory as getAuthenticatedOctokit} from './octokit/factory.js';
import {scaffold as scaffoldRepository} from './repository/index.js';

export default async function ({name, owner, visibility}) {
  info('Initializing GitHub');

  const octokit = getAuthenticatedOctokit();

  const repositoryResult = await scaffoldRepository({octokit, name, owner, visibility});

  return {...repositoryResult};
}
