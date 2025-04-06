import {test as repositoryMaintainedWithRepositorySettings, lift as liftSettings} from '@form8ion/repository-settings';

import nextSteps from './next-steps/next-steps.js';

export default async function ({projectRoot, vcs, results}, {octokit}) {
  if (await repositoryMaintainedWithRepositorySettings({projectRoot})) {
    await liftSettings({projectRoot, results});
  }

  return nextSteps({results, vcs}, {octokit});
}
