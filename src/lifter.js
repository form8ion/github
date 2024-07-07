import {test as repositoryMaintainedWithRepositorySettings, lift as liftSettings} from '@form8ion/repository-settings';

export default async function ({projectRoot, results}) {
  if (await repositoryMaintainedWithRepositorySettings({projectRoot})) {
    return liftSettings({projectRoot, results});
  }

  return {};
}
