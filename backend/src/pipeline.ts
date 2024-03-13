import { PipelineInputs } from './utils';

export async function pipeline(inputs: PipelineInputs): Promise<string> {
  return `${inputs.framework} - ${inputs.userDescription}`
}
