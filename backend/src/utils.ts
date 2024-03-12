import { v4 as uuid } from 'uuid';
import * as path from 'path';
import fs from 'fs';

export function formatString(templateString: string, values: Record<string, string>) {
  let formattedString = templateString;
  for (const key in values) {
    const placeholder = `{${key}}`;
    const value = values[key];
    formattedString = formattedString.replace(new RegExp(placeholder, 'g'), value);
  }
  return formattedString;
}

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
