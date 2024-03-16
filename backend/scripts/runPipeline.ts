import { pipeline } from '../src/pipeline';

const userDescription =
  `Generate a list of 3 items with a searchbar and a select filter inline. 
Each item has a title and a description and a small photo on the left.
Every item has 3 actions: delete, duplicate and edit.
The actions are aligned on the end`;

pipeline({
  userDescription,
}).then((result) => {
  console.log(result);
}).catch((error) => {
  console.error(error);
});