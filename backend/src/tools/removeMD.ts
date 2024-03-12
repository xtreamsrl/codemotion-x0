import { Tool } from '@langchain/core/tools';

/**
 * Utils function to remove markdown multiline code markup from the input
 * @param input The input to remove the markdown from
 * @returns The input without the markdown multiline code markup
 */
export function removeMD(input: string): string {
  // remove ```tsx from the first line and remove ``` from the last line
  return input.replace(/^```tsx\n/, '').replace(/```$/, '');
}

/**
 * Langchain tool to remove markdown multiline code markup from the generated content
 */
export class RemoveMD extends Tool {
  name = 'RemoveMD';
  description = 'Remove the markdown from the received content';

  async _call(input: string): Promise<string> {
    return removeMD(input);
  }
}
