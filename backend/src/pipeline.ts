import { PipelineInputs, PipelineOutput } from './utils/types';
import { designStep } from './steps/designStep';
import { codeGenerationStep } from './steps/codeGenerationStep';

export async function pipeline(inputs: PipelineInputs): Promise<PipelineOutput> {
  const designOutput = await designStep(inputs);
  console.log(designOutput);

  const sourceCode = await codeGenerationStep(designOutput);
  console.log(sourceCode);

  return {
    code: 'console.log("Hello, World!")',
    path: 'path/to/file.tsx',
  };
}
