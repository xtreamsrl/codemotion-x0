import fs from 'fs';
import { validate } from '../src/utils/validation';

(() => {
  const sourceFile = '';
  const sourceCode = fs.readFileSync(sourceFile, 'utf-8');
  validate(sourceCode)
})()
