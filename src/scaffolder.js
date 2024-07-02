import {promises as fs} from 'node:fs';
import {info} from '@travi/cli-messages';

import {factory as getAuthenticatedOctokit} from './octokit/factory.js';
import {scaffold as scaffoldRepository} from './repository/index.js';

export default async function ({name, owner, visibility, projectRoot}) {
  info('Initializing GitHub');

  const octokit = getAuthenticatedOctokit();

  const [repositoryResult] = await Promise.all([
    scaffoldRepository({octokit, name, owner, visibility}),
    fs.mkdir(`${projectRoot}/.github`, {recursive: true})
  ]);

  return {...repositoryResult};
}
