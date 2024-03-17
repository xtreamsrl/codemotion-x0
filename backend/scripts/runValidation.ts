import fs from 'fs';
import { validate } from '../src/utils/validation';
import { fixErrorsStep } from '../src/steps/fixErrorsStep';
import { saveFixIteration } from '../src/utils/utils';

(async () => {
  const sourceFile = '';
  const sourceCode = fs.readFileSync(sourceFile, 'utf-8');
  const validationOutput = validate(sourceCode);
  console.log(validationOutput);

  const fixedCode = await fixErrorsStep(sourceCode, validationOutput.errors);
  saveFixIteration(sourceFile, fixedCode)
  console.log(fixedCode);
})()
