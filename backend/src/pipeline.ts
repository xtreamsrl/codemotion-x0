import { PipelineInputs, PipelineOutput } from './utils/types';
import { designStep } from './steps/designStep';
import { codeGenerationStep } from './steps/codeGenerationStep';
import { saveGeneratedFile } from './utils/utils';
import { validate } from './utils/validation';
import { fixErrorsStep } from './steps/fixErrorsStep';

export async function pipeline(inputs: PipelineInputs): Promise<PipelineOutput> {
  const designOutput = await designStep(inputs);
  console.log(designOutput);

  let sourceCode = await codeGenerationStep(designOutput);
  console.log(sourceCode);
  const validationOutput = validate(sourceCode);
  if (!validationOutput.success) {
    const fixedSourceCode = await fixErrorsStep(sourceCode, validationOutput.errors);
    sourceCode = fixedSourceCode;
  }

  const path = saveGeneratedFile(sourceCode);
  return {
    code: sourceCode,
    path,
  };
}
