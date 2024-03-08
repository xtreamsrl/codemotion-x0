import { designStep } from './steps/designNewComponent';
import { RunnableSequence } from '@langchain/core/runnables';
import { buildContextStep } from './steps/buildContext';
import { generateNewComponentStep } from './steps/generateNewComponent';
import * as path from 'path';
import { SaveContentToFile } from './tools/saveContentToFile';

const baseDir = path.join(__dirname, '..', '..', 'frontend', 'src', 'generated');

export type PipelineInputs = {
  userDescription: string;
  framework: string;
}

export async function pipeline(inputs: PipelineInputs) {
  const pipeline = RunnableSequence.from([
    await designStep(),
    buildContextStep(),
    generateNewComponentStep(),
    new SaveContentToFile(baseDir),
  ]);

  const filePath = await pipeline.invoke(inputs);

  console.log(filePath);
  return filePath;
}
