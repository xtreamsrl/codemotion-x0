import fs from 'fs';
import { validate } from 'uuid';

(() => {
  const sourceFile = '';
  const sourceCode = fs.readFileSync(sourceFile, 'utf-8');
  validate(sourceCode)
})()
