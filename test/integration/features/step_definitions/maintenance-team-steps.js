import {Given} from '@cucumber/cucumber';
import any from '@travi/any';

Given('a maintenance team exists in the organization', async function () {
  this.maintenanceTeamId = any.integer();
});
