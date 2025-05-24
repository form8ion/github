import {constants} from '../prompt/index.js';

export default async function promptForRepositoryOwner(prompt) {
  const promptId = constants.ids.GITHUB_DETAILS;
  const githubAccountQuestionName = constants.questionNames[promptId].GITHUB_ACCOUNT;

  const {[githubAccountQuestionName]: owner} = await prompt({
    id: promptId,
    questions: [{
      name: githubAccountQuestionName,
      message: 'Which GitHub account should the repository be hosted within?'
    }]
  });

  return owner;
}
