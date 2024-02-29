import {
  designNewComponentFromDescriptionPrompt,
  DesignNewComponentFromDescriptionPromptInput,
} from '../prompts/designNewComponentFromDescription';
import LIBRARY_COMPONENTS from '../data/xtream-ui-kit/components.json';
import { ChatOpenAI } from '@langchain/openai';
import { JsonOutputFunctionsParser } from 'langchain/output_parsers';
import { createStructuredOutputRunnable } from "langchain/chains/openai_functions";

const designNewComponentFromDescriptionSchema = {
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

export function designStep() {
  const model = new ChatOpenAI({
    modelName: "gpt-4-0125-preview",
    streaming: true,
  });
  return createStructuredOutputRunnable<DesignNewComponentFromDescriptionPromptInput, NewComponentDesignOutput>({
    prompt: designNewComponentFromDescriptionPrompt,
    llm: model,
    outputSchema: designNewComponentFromDescriptionSchema,
    outputParser: new JsonOutputFunctionsParser<NewComponentDesignOutput>(),
  });
}
