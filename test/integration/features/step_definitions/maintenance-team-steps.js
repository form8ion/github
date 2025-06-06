import {Given} from '@cucumber/cucumber';
import any from '@travi/any';
import {http, HttpResponse} from 'msw';
import {authorizationHeaderIncludesToken} from './repository-steps.js';

Given('a maintenance team exists in the organization', async function () {
  this.maintenanceTeamId = any.integer();
  this.maintenanceTeamName = any.word();
  this.maintenanceTeamSlug = any.word();
  const anyTeam = () => ({id: any.integer(), name: any.word(), slug: any.word()});

  this.server.use(
    http.get(`https://api.github.com/orgs/${this.organizationAccount}/teams`, ({request}) => {
      if (authorizationHeaderIncludesToken(request)) {
        return HttpResponse.json([
          ...any.listOf(anyTeam),
          {id: this.maintenanceTeamId, name: this.maintenanceTeamName, short: this.maintenanceTeamSlug},
          ...any.listOf(anyTeam)
        ]);
      }

      return undefined;
    })
  );
});
