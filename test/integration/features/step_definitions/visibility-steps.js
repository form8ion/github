import {visibilityOptions} from '@form8ion/core';

import {Given} from '@cucumber/cucumber';

Given('the visibility of the repository should be {string}', async function (visibilityDescription) {
  const [visibility] = Object.entries(visibilityOptions)
    .find(([, description]) => description === visibilityDescription);

  this.projectVisibility = visibility;
});
