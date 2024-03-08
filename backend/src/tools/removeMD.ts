import { Tool } from '@langchain/core/tools';

export class RemoveMD extends Tool {
  name = 'RemoveMD';
  description = 'Remove the markdown from the received content';

  async _call(input: string): Promise<string> {
    // todo move the clean
    // remove ```tsx from the first line
    const clean = input.replace(/^```tsx\n/, '');
    // remove ``` from the last line
    const clean2 = clean.replace(/```$/, '');
    return clean2;
  }
}
