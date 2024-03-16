import { makePromptTemplate } from '../utils/utils';

export const designSystemPrompt =
  `Your task is to design a new React component for a web app, according to the user's request.
Take into account every details specified in the user query.
Use the provided library components to help you design the new component.`;

const designUserPrompt =
  `User query: "{userDescription}"

Available library components:
{libraryComponents}

Take a deep breath and design the new React web component as the creative genius you are.
`;

export const designUserPromptTemplate =
  makePromptTemplate<'userDescription' | 'libraryComponents'>(designUserPrompt);
