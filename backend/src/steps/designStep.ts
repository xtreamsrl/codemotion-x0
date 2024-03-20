import { PipelineInputs } from '../utils/types';
import OpenAI from 'openai';
import COMPONENT_METADATA from '../data/components.json';
import { designSystemPrompt, designUserPromptTemplate } from '../prompts/design';

export async function designStep(inputs: PipelineInputs): Promise<string> {
  // Retrieve context
  const componentList = COMPONENT_METADATA.map(
    (component) => `${component.name} : ${component.description}`,
  ).join('\n');

  // Prepare prompt messages
  const designUserPrompt = designUserPromptTemplate.format({
    userDescription: inputs.userDescription,
    libraryComponents: componentList,
  });
  const messages = [
    { role: 'system' as const, content: designSystemPrompt },
    { role: 'user' as const, content: designUserPrompt },
  ];

  // Invoke llm
  const openaiClient = new OpenAI();
  const chatCompletion = await openaiClient.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages,
  });

  // Parse/format output
  const designOutput = chatCompletion.choices[0].message.content;
  if (!designOutput) {
    throw new Error('Failed to generate design output');
  }
  return designOutput;
}
