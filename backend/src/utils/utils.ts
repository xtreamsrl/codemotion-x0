import * as path from 'path';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import LIBRARY_COMPONENTS_METADATA from '../data/components.json';

export type PipelineInputs = {
  userDescription: string;
};

export type PipelineOutput = {
  code: string;
  path: string;
};

type ComponentMetadata = {
  name: string;
  description: string;
  usageReason: string;
  extension: string;
  importCode: string;
  info: string;
  usageExamples: string;
}

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
export function saveToFile(basePath: string, content: string, executionId?: string) {
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
  }
  const filename = executionId ? `${executionId}.tsx` : `${uuid()}.tsx`;
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
  const logPath = path.join(__dirname, 'logs');
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, { recursive: true });
  }
  const logFilePath = path.join(logPath, `${executionId}.json`);
  const log = fs.existsSync(logFilePath) ? JSON.parse(fs.readFileSync(logFilePath, 'utf-8')) : {};
  log[stepName] = { input, output };
  fs.writeFileSync(logFilePath, JSON.stringify(log, null, 2));
}

/**
 * Get the component metadata and format them to be used in the code generation step
 * @param component The component to get the metadata for
 * @returns The formatted component metadata
 */
export function getComponentMetadata(component: {
  libraryComponentName: string;
  libraryComponentUsageReason: string;
}): ComponentMetadata {
  console.log('Build context step started...');
  const componentMetadata = LIBRARY_COMPONENTS_METADATA.filter(componentMeta => componentMeta.name === component.libraryComponentName);
  if (componentMetadata.length === 0) {
    throw new Error(`Component ${component.libraryComponentName} not found in the library`);
  }
  return {
    name: componentMetadata[0].name,
    description: componentMetadata[0].description,
    usageReason: component.libraryComponentUsageReason,
    extension: componentMetadata[0].extension,
    importCode: componentMetadata[0].docs.import.code.trim(),
    info: componentMetadata[0].docs.info.map(info => `\`\`\`${info.source}\n${info.code.trim()}\n\`\`\``).join('\n'),
    usageExamples: componentMetadata[0].docs.examples.map(example => `\`\`\`${example.source}\n${example.code.trim()}\n\`\`\``).join('\n'),
  };
}
