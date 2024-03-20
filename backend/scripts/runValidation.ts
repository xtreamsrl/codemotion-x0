import fs from 'fs';
import { validate } from '../src/utils/validation';

(async () => {
  const sourceFile = '';
  const sourceCode = fs.readFileSync(sourceFile, 'utf-8');
  const validationOutput = validate(sourceCode);
  console.log(validationOutput);
})()
