import {
  rawDesignContextPrompt,
  rawDesignSystemPrompt,
  rawDesignTaskPrompt,
} from '../prompts/designNewComponentFromDescription';
import LIBRARY_COMPONENTS from '../data/components.json';
import OpenAI from 'openai';
import { formatString, PipelineInputs } from '../utils';

export const designNewComponentFromDescriptionSchema = {
  type: 'object',
  title: 'NewComponentDesign',
  description: 'Design a new component from the user query using the provided library components.',
  properties: {
    newComponentName: {
      type: 'string',
      description: `The name of the new component to be designed.`,
    },
    newComponentDescription: {
      type: 'string',
      description: 'A description for the component design task strictly based on the user query.',
    },
    useLibraryComponents: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          libraryComponentName: {
            type: 'string',
            enum: LIBRARY_COMPONENTS.map(component => component.name),
          },
          libraryComponentUsageReason: {
            type: 'string',
            description: `The reason why the library component is being used.`,
          },
        },
        required: ['libraryComponentName', 'libraryComponentUsageReason'],
      },
    },
  },
  required: ['newComponentName', 'newComponentDescription', 'useLibraryComponents'],
} as const;

export type NewComponentDesignOutput = {
  newComponentName: string;
  newComponentDescription: string;
  useLibraryComponents: {
    libraryComponentName: string;
    libraryComponentUsageReason: string;
  }[]
};

export async function designStep(openaiClient: OpenAI, inputs: PipelineInputs): Promise<NewComponentDesignOutput | undefined> {
  console.log('Design step started...');
  const designSystemPrompt = formatString(rawDesignSystemPrompt, inputs);
  const designContextPrompt = formatString(rawDesignContextPrompt, inputs);
  const designTaskPrompt = formatString(rawDesignTaskPrompt, inputs);
  const designMessages = [
    { role: 'system' as const, content: designSystemPrompt },
    { role: 'user' as const, content: designContextPrompt },
    { role: 'user' as const, content: designTaskPrompt },
  ];
  const chatCompletion = await openaiClient.chat.completions.create({
    messages: designMessages,
    model: 'gpt-4-0125-preview',
    tool_choice: { type: 'function', function: { name: 'designNewComponentFromDescription' } },
    tools: [{
      type: 'function',
      function: {
        name: 'designNewComponentFromDescription',
        description: 'Generate the required design details to create a new component',
        parameters: designNewComponentFromDescriptionSchema,
      },
    }],
  });
  const chatCompletionResult = chatCompletion.choices[0].message.tool_calls;
  let designOutput = undefined;
  if (chatCompletionResult) {
    designOutput = JSON.parse(chatCompletionResult[0].function.arguments);
  }
  console.log('Design step completed.');
  return designOutput;
}
