import { makePromptTemplate } from '../utils/utils';

export const fixErrorsSystemPrompt =
  `You are a talented senior software engineer, an expert in React and TypeScript
and you have excellent analytical skills and problem-solving abilities.
Your task is to fix errors in a React component code.`;

const fixErrorsUserPrompt =
  `The following code has errors. Take into account only the errors indicated and do not change other part of the code. Respond with the entire corrected code and do not add any other explanation or comments.

Source code:
{sourceCode}

Errors:
{errors}`;

export const fixErrorsUserPromptTemplate = makePromptTemplate<'sourceCode' | 'errors'>(fixErrorsUserPrompt);
