import * as path from 'path';
import fs from 'fs';

export type PipelineInputs = {
  userDescription: string;
  framework: string;
};

/**
 * Utils function to format a string with values
 * @param templateString The string to format
 * @param values The values to use for the formatting
 * @returns The formatted string
 */
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
  return input.replace(/^```[tj]sx\n/, '').replace(/```$/, '');
}

/**
 * Utils function to save the content to a file
 * @param basePath The base path to save the file
 * @param executionId The execution id to use as a file name
 * @param content The content to save
 * @returns The path to the saved file
 */
export function saveToFile(basePath: string, executionId: string, content: string) {
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
  }
  const filename = `${executionId}.tsx`;
  const filePath = path.join(basePath, filename);
  fs.writeFileSync(filePath, content);
  return filename;
}

/**
 * Utils function to log the step data to a file
 * @param executionId The execution id to use as a file name
 * @param stepName The name of the step to log
 * @param input The input data to log
 * @param output The output data to log
 * @returns void
 */
export function logStepData(executionId: string, stepName: string, input: any, output: any) {
  const logPath = path.join(__dirname, 'tmp', 'logs');
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, { recursive: true });
  }
  const logFilePath = path.join(logPath, `${executionId}.json`);
  const log = fs.existsSync(logFilePath) ? JSON.parse(fs.readFileSync(logFilePath, 'utf-8')) : {};
  log[stepName] = { input, output };
  fs.writeFileSync(logFilePath, JSON.stringify(log, null, 2));
}
