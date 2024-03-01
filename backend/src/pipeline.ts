import { designStep } from './steps/designNewComponent';
import { RunnableSequence } from '@langchain/core/runnables';
import { buildContextStep } from './steps/buildContext';
import { generateNewComponentStep } from './steps/generateNewComponent';
import * as path from 'path';
import { SaveContentToFile } from './tools/saveContentToFile';

export type PipelineInputs = {
  userDescription: string;
  framework: string;
}

export async function pipeline(inputs: PipelineInputs) {
  const pipeline = RunnableSequence.from([
    await designStep(),
    buildContextStep(),
    generateNewComponentStep(),
    new SaveContentToFile(path.join(__dirname, 'tmp')),
  ]);

  const filePath = await pipeline.invoke(inputs);

  console.log(filePath);
  return filePath;
}
