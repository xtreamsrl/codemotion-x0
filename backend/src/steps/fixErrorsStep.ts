import OpenAI from 'openai';
import { fixErrorsSystemPrompt, fixErrorsUserPromptTemplate } from '../prompts/fixErrors';
import { removeMD } from '../utils/utils';

export async function fixErrorsStep(sourceCode: string, errors: string[]): Promise<string> {
  // Prepare prompt messages
  const systemPrompt = fixErrorsSystemPrompt
  const userPrompt = fixErrorsUserPromptTemplate.format({
    errors: errors.join('\n'),
    sourceCode: sourceCode,
  })
  // Invoke llm
  const openaiClient = new OpenAI();
  const chatCompletion = await openaiClient.chat.completions.create({
    model: 'gpt-4-0125-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  const fixedCode = chatCompletion.choices[0].message.content;
  if (!fixedCode) {
    throw new Error('Failed to fix errors');
  }
  return removeMD(fixedCode);
}
