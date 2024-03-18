import { pipeline } from '../src/pipeline';

const threeItemsCardPlainActions =
  `Generate a list of 3 items with a searchbar and a select filter inline. 
Each item is a card with a title and a description and a small image on the left.
There are 2 cta buttons in plain text: delete, duplicate.
The actions are aligned on the end`;

const loginForm =
  `Create a login page for a social network. The form should be inside a Card,
   there are two inputs (email and password) and a login button. A forgot password link is also present.
   A non registered user should be able to register by clicking on a link below the form.`;

const threeItemsCardIconActions =
  `Generate a list of 3 items with a searchbar and a select filter inline. 
Each item is a card with a title and a description and a small image on the left.
There are 3 icon buttons: delete, duplicate and edit.
The actions are aligned on the end`;


pipeline({
  userDescription: threeItemsCardPlainActions,
}).then((result) => {
  console.log(result);
}).catch((error) => {
  console.error(error);
});
