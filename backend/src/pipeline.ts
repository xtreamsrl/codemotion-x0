import { PipelineInputs, PipelineOutput } from './utils/utils';

export async function pipeline(inputs: PipelineInputs): Promise<PipelineOutput> {
  return {
    code: 'console.log("Hello, World!")',
    path: 'path/to/file.tsx',
  }
}
