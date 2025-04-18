import {test as repositoryMaintainedWithRepositorySettings, lift as liftSettings} from '@form8ion/repository-settings';

import nextSteps from './next-steps/next-steps.js';

export default async function liftGithub({projectRoot, vcs, results}, {octokit, logger}) {
  logger.info('Lifting GitHub');

  if (await repositoryMaintainedWithRepositorySettings({projectRoot})) {
    await liftSettings({projectRoot, results, vcs}, {logger});
  }

  return nextSteps({results, vcs}, {octokit});
}
