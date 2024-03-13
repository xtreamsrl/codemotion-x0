import OpenAI from 'openai';
import { formatString } from '../utils';
import { Context } from './buildContext';
import { rawComponentContextPrompt } from '../prompts/componentContext';

const rawFixErrorsSystemPrompt =
  `You are a talented senior software engineer, you are an expert in {framework} and TypeScript
and you have excellent analytical skills and problem-solving abilities. You are tasked with fixing some errors in a {framework} component.
Always return only the correct source code.`;

const rawFixErrorsTaskPrompt =
  `The following generated component has errors, fix them please. Respond only with the code and do not add any other explanation.
Source code:
{sourceCode}
Errors:
{errors}
`;

export type FixErrorsStepInputs = {
  sourceCode: string;
  errors: string[];
  framework: string;
}

export async function fixErrorsStep(openaiClient: OpenAI, context: Context, inputs: FixErrorsStepInputs): Promise<string | null> {
  console.log('Fix errors step started...');
  const contextMessages = context.components.map(component => formatString(rawComponentContextPrompt, component));
  const fixErrorsSystemPrompt = formatString(rawFixErrorsSystemPrompt, { framework: inputs.framework });
  const fixErrorsPromptWithErrors = formatString(rawFixErrorsTaskPrompt, {
    errors: inputs.errors.join('\n'),
    sourceCode: inputs.sourceCode,
  });
  const fixMessages = [
    { role: 'system' as const, content: fixErrorsSystemPrompt },
    ...contextMessages.map(content => ({ role: 'user' as const, content })),
    { role: 'user' as const, content: fixErrorsPromptWithErrors },
  ];
  const chatCompletion = await openaiClient.chat.completions.create({
    messages: fixMessages,
    model: 'gpt-4-0125-preview',
  });
  console.log('Fix errors step completed.');
  return chatCompletion.choices[0].message.content;
}
