import { PipelineInputs } from './utils/utils';

export async function pipeline(inputs: PipelineInputs): Promise<string> {
  return `${inputs.userDescription}`
}
