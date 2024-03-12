import { HumanMessagePromptTemplate } from '@langchain/core/prompts';

export const rawComponentContextPrompt =
  `Suggested library component:
  Name: {name}
  Description: {description}
  Usage reason: {usageReason}
  Import example:
    \`\`\`{extension}
    {importCode}
    \`\`\`
  Additional information about the {name} component props and styling:
  {info}
  Full code examples of how {name} can be used inside the new component:
  {usageExamples}
---
`;

// --- Langchain ---

export const componentContextPrompt = HumanMessagePromptTemplate.fromTemplate(rawComponentContextPrompt);
