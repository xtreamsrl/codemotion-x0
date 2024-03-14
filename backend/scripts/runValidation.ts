import { validate } from '../src/steps/validationStep';
import fs from 'fs';

(() => {
  const sourceFile = '';
  const sourceCode = fs.readFileSync(sourceFile, 'utf-8');
  validate(sourceCode)
})()
