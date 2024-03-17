import { DesignNewComponentOutput } from '../utils/types';
import {
  componentMetadataPromptTemplate,
  generateCodeSystemPrompt,
  generateCodeUserPromptTemplate,
} from '../prompts/generateCode';
import OpenAI from 'openai';
import { getComponentMetadata, removeMD } from '../utils/utils';

export async function codeGenerationStep(inputs: DesignNewComponentOutput): Promise<string> {
  // Retrieve context
  const componentMetadata = inputs.useLibraryComponents.map(componentMetadata => getComponentMetadata(componentMetadata));

  // Format prompts
  const codeGenerationUserPrompt = generateCodeUserPromptTemplate.format({
    newComponentName: inputs.newComponentName,
    newComponentDescription: inputs.newComponentDescription,
  });
  const componentMetadataMessages = componentMetadata.map(metadata => (
    { role: 'user' as const, content: componentMetadataPromptTemplate.format(metadata)}
  ));
  const messages = [
    { role: 'system' as const, content: generateCodeSystemPrompt },
    ...componentMetadataMessages,
    { role: 'user' as const, content: codeGenerationUserPrompt },
  ];

  // Invoke llm
  const openaiClient = new OpenAI();
  const chatCompletion = await openaiClient.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages,
  });

  // Parse/format output
  const sourceCode = chatCompletion.choices[0].message.content;
  if (!sourceCode) {
    throw new Error('Failed to generate source code');
  }
  return removeMD(sourceCode);
}