import { lcDesignStep } from './steps/designNewComponent';
import { RunnableSequence } from '@langchain/core/runnables';
import { lcBuildContextStep } from './steps/buildContext';
import { lcGenerateNewComponentStep } from './steps/generateNewComponent';
import * as path from 'path';
import { SaveContentToFileTool } from './tools/saveContentToFile';
import { RemoveMDTool } from './tools/removeMD';
import { PipelineInputs } from './utils';

const baseDir = path.join(__dirname, '..', '..', 'frontend', 'src', 'generated');

export async function lcPipeline(inputs: PipelineInputs) {
  const pipeline = RunnableSequence.from([
    await lcDesignStep(),
    lcBuildContextStep(),
    lcGenerateNewComponentStep(),
    new RemoveMDTool(),
    new SaveContentToFileTool(baseDir),
  ]);

  const fileName = await pipeline.invoke(inputs);

  console.log(fileName);
  return fileName;
}
