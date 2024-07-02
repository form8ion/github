import {Given} from '@cucumber/cucumber';

Given('the visibility of the repository should be {string}', async function (visibility) {
  this.projectVisibility = visibility;
});
