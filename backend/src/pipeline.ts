import { designStep } from './steps/designNewComponent';
import { RunnableSequence } from '@langchain/core/runnables';
import { buildContextStep } from './steps/buildContext';
import { generateNewComponentStep } from './steps/generateNewComponent';
import * as path from 'path';
import { SaveContentToFile } from './tools/saveContentToFile';
import { RemoveMD } from './tools/removeMD';

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
    new RemoveMD(),
    new SaveContentToFile(baseDir),
  ]);

  const fileName = await pipeline.invoke(inputs);

  console.log(fileName);
  return fileName;
}
