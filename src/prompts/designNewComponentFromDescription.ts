import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';

const designSystemPrompt = SystemMessagePromptTemplate.fromTemplate("Your task is to design a new {framework} component for a web app, according to the user's request. If you judge it is relevant to do so, you can specify pre-made library components to use in the task.");
const designContextPrompt = HumanMessagePromptTemplate.fromTemplate("Multiple library components can be used while creating a new component in order to help you do a better design job, faster. Available library component: {libraryComponents}.");
const designUserDescriptionPrompt = HumanMessagePromptTemplate.fromTemplate("User query: {userDescription}.");
const designTaskPrompt = HumanMessagePromptTemplate.fromTemplate('Take a deep breath and design the new {framework} web component as the creative genius you are.')

export type DesignNewComponentFromDescriptionPromptInput = {
  framework: string;
  libraryComponents: string;
  userDescription: string;
};

export const designNewComponentFromDescriptionPrompt = ChatPromptTemplate.fromMessages([
  designSystemPrompt,
  designContextPrompt,
  designUserDescriptionPrompt,
  designTaskPrompt
]) as ChatPromptTemplate<DesignNewComponentFromDescriptionPromptInput>
