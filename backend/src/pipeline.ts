import { PipelineInputs, PipelineOutput } from './utils/types';
import { designStep } from './steps/designStep';

export async function pipeline(inputs: PipelineInputs): Promise<PipelineOutput> {
  const designOutput = await designStep(inputs);
  console.log(designOutput);

  return {
    code: 'console.log("Hello, World!")',
    path: 'path/to/file.tsx',
  };
}
