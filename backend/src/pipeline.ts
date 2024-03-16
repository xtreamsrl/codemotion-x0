import { PipelineInputs, PipelineOutput } from './utils/types';
import { designStep } from './steps/designStep';
import { codeGenerationStep } from './steps/codeGenerationStep';
import { saveGeneratedFile } from './utils/utils';

export async function pipeline(inputs: PipelineInputs): Promise<PipelineOutput> {
  const designOutput = await designStep(inputs);
  console.log(designOutput);

  const sourceCode = await codeGenerationStep(designOutput);
  console.log(sourceCode);

  const path = saveGeneratedFile(sourceCode);
  return {
    code: sourceCode,
    path,
  };
}
