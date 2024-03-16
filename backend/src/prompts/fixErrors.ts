import { makePromptTemplate } from '../utils/utils';

export const fixErrorsSystemPrompt =
  `You are a talented senior software engineer, you are an expert in React and TypeScript
and you have excellent analytical skills and problem-solving abilities.
You are tasked with fixing some errors in a React component.`;

const fixErrorsUserPrompt =
  `The following generated component has errors, fix them please. Respond only with the code and do not add any other explanation.
Source code:
{sourceCode}
Errors:
{errors}`;

export const fixErrorsUserPromptTemplate = makePromptTemplate<'sourceCode' | 'errors'>(fixErrorsUserPrompt);
