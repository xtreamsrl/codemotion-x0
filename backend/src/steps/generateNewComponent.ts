import { rawGenerateSystemPrompt, rawGenerateTaskPrompt } from '../prompts/generateNewComponentFromDescription';
import { Context } from './buildContext';
import { rawComponentContextPrompt } from '../prompts/componentContext';
import { formatString, PipelineInputs } from '../utils';
import OpenAI from 'openai';

export async function generateNewComponentStep(openaiClient: OpenAI, inputs: Context & PipelineInputs): Promise<string | null> {
  console.log('Generation step started...');
  const contextMessages = inputs.components.map(component => formatString(rawComponentContextPrompt, component));
  const generateSystemPrompt = formatString(rawGenerateSystemPrompt, { framework: inputs.framework });
  const generateTaskPrompt = formatString(rawGenerateTaskPrompt, {
    newComponentName: inputs.newComponentName,
    newComponentDescription: inputs.newComponentDescription,
    framework: inputs.framework,
  });
  const generationMessages = [
    { role: 'system' as const, content: generateSystemPrompt },
    ...contextMessages.map(content => ({ role: 'user' as const, content })),
    { role: 'user' as const, content: generateTaskPrompt },
  ];
  const chatCompletion = await openaiClient.chat.completions.create({
    messages: generationMessages,
    model: 'gpt-4-0125-preview',
  });

  console.log('Generation step completed.');
  return chatCompletion.choices[0].message.content;
}
