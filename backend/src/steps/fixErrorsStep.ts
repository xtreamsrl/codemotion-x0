import OpenAI from 'openai';
import { formatString } from '../utils';

const rawFixErrorsSystemPrompt =
  `You are a talented senior software engineer, you are an expert in {framework} and TypeScript
and you have excellent analytical skills and problem-solving abilities. You are tasked with fixing some errors in a {framework} component.
Always return only the correct source code.`;

const rawFixErrorsTaskPrompt =
  `The following generated component has errors, fix them please.
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

type Message = {
  role: 'user' | 'system',
  content: string
}

export async function fixErrorsStep(openaiClient: OpenAI, messageHistory: Message[], inputs: FixErrorsStepInputs): Promise<string | null> {
  const fixErrorsSystemPrompt = formatString(rawFixErrorsSystemPrompt, { framework: inputs.framework });
  const fixErrorsPromptWithErrors = formatString(rawFixErrorsTaskPrompt, {
    errors: inputs.errors.join('\n'),
    sourceCode: inputs.sourceCode,
  });
  const fixMessages = [
    ...messageHistory,
    { role: 'system' as const, content: fixErrorsSystemPrompt },
    { role: 'user' as const, content: fixErrorsPromptWithErrors },
  ];
  const chatCompletion = await openaiClient.chat.completions.create({
    messages: fixMessages,
    model: 'gpt-4-0125-preview',
  });
  return chatCompletion.choices[0].message.content;
}
