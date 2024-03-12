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
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
  }
  const filename = `${uuid()}.tsx`;
  const filePath = path.join(basePath, filename);
  fs.writeFileSync(filePath, content);
  return filename;
}

// --- Langchain ---

/**
 * Langchain tool to save the received content to a file
 */
export class SaveContentToFileTool extends Tool {
  name = 'SaveContentToFile';
  description = 'Save the received content to a file';

  basePath: string;

  constructor(basePath: string) {
    super(...arguments)
    this.basePath = basePath;
  }

  async _call(input: string): Promise<string> {
    return saveToFile(this.basePath, input);
  }
}
