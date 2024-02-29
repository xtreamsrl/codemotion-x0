import { ChatOpenAI } from '@langchain/openai';
import {
  GenerateNewComponentFromDescriptionPromptInput,
  generateSystemPrompt,
  generateTaskPrompt,
} from '../prompts/generateNewComponentFromDescription';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { Context } from './buildContextStep';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableLambda, RunnableSequence } from '@langchain/core/runnables';
import { componentContextPrompt } from '../prompts/componentContext';

async function generateNewComponentPrompt(inputs: Context): Promise<ChatPromptTemplate<GenerateNewComponentFromDescriptionPromptInput>> {
  // Create a prompt message for each component data from the context
  const contextMessages = await Promise.all(
    inputs.components.map(
      component => componentContextPrompt.format(component),
    ),
  );
  const data = {
    newComponentDescription: inputs.newComponentDescription,
    newComponentName: inputs.newComponentName,
    framework: 'React', // TODO : get this from the context with a RunnablePassthrough
  };
  const systemPrompt = await generateSystemPrompt.format(data);
  const generationPrompt = await generateTaskPrompt.format(data);
  return ChatPromptTemplate.fromMessages([
    systemPrompt,
    ...contextMessages,
    generationPrompt,
  ]);
}

export function generateNewComponentStep() {
  const model = new ChatOpenAI({
    modelName: "gpt-4-0125-preview",
    streaming: true,
  });

  return RunnableSequence.from([
    new RunnableLambda<Context, ChatPromptTemplate<GenerateNewComponentFromDescriptionPromptInput>>({
      func: generateNewComponentPrompt,
    }),
    model,
    new StringOutputParser(),
  ]);
}
