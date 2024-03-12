import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';

export const rawDesignSystemPrompt =
  `Your task is to design a new {framework} component for a web app, according to the user's request.
Take into account every details specified in the user query.
Use the provided library components to help you design the new component.`;

export const rawDesignContextPrompt =
  `User query: "{userDescription}"
Available library components:
{libraryComponents}`;

export const rawDesignTaskPrompt =
  `Take a deep breath and design the new {framework} web component as the creative genius you are.`;

// --- Langchain ---

const designSystemPrompt = SystemMessagePromptTemplate.fromTemplate(rawDesignSystemPrompt);
const designContextPrompt = HumanMessagePromptTemplate.fromTemplate(rawDesignContextPrompt);
const designTaskPrompt = HumanMessagePromptTemplate.fromTemplate(rawDesignTaskPrompt);

export type DesignNewComponentFromDescriptionPromptInput = {
  framework: string;
  libraryComponents: string;
  userDescription: string;
};

export const designNewComponentFromDescriptionPrompt = ChatPromptTemplate.fromMessages([
  designSystemPrompt,
  designContextPrompt,
  designTaskPrompt,
]) as ChatPromptTemplate<DesignNewComponentFromDescriptionPromptInput>;
