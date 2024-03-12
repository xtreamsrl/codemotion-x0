import { ChatOpenAI } from '@langchain/openai';
import {
  GenerateNewComponentFromDescriptionPromptInput,
  generateSystemPrompt,
  generateTaskPrompt, rawGenerateSystemPrompt, rawGenerateTaskPrompt,
} from '../prompts/generateNewComponentFromDescription';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { Context } from './buildContext';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableLambda, RunnableSequence } from '@langchain/core/runnables';
import { componentContextPrompt, rawComponentContextPrompt } from '../prompts/componentContext';
import { formatString, PipelineInputs } from '../utils';
import OpenAI from 'openai';

export async function generateNewComponentStep(openaiClient: OpenAI, inputs: Context & PipelineInputs): Promise<string | null> {
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

  return chatCompletion.choices[0].message.content;
}

// --- Langchain ---

async function generateNewComponentPrompt(inputs: Context): Promise<ChatPromptTemplate<GenerateNewComponentFromDescriptionPromptInput>> {
  // Create a prompt message for each component data from the context
  const contextMessages = await Promise.all(
    inputs.components.map(
      component => componentContextPrompt.format(component),
    ),
  );
  // todo utils viene preso ogni volta e ci stanon un triliardo di token
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

export function lcGenerateNewComponentStep() {
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
