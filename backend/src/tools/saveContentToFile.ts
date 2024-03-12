import { Tool } from '@langchain/core/tools';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import fs from 'fs';

/**
 * Utils function to save the content to a file
 * @param basePath The base path to save the file
 * @param content The content to save
 * @returns The path to the saved file
 */
export function saveToFile(basePath: string, content: string) {
  const filename = `${uuid()}.tsx`;
  const filePath = path.join(basePath, filename);
  fs.writeFileSync(filePath, content);
  return filename;
}

/**
 * Langchain tool to save the received content to a file
 */
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

  async _call(input: string): Promise<string> {
    return saveToFile(this.basePath, input);
  }
}
