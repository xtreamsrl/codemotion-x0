import { Tool } from '@langchain/core/tools';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import fs from 'fs';

export class SaveContentToFile extends Tool {
  name = 'SaveContentToFile';
  description = 'Save the received content to a file';

  basePath: string;

  constructor(basePath: string) {
    super(...arguments)
    this.basePath = basePath;
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath);
    }
  }

  private fileName(): string {
    return `${uuid()}.tsx`;
  }

  async _call(input: string): Promise<string> {
    const filename = this.fileName();
    const filePath = path.join(this.basePath, filename);
    fs.writeFileSync(filePath, input);
    return filePath;
  }
}
