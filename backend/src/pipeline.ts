import { PipelineInputs, PipelineOutput } from './utils/types';
import { designStep } from './steps/designStep';
import { codeGenerationStep } from './steps/codeGenerationStep';
import { saveFixIteration, saveGeneratedFile } from './utils/utils';
import { validate } from './utils/validation';
import { fixErrorsStep } from './steps/fixErrorsStep';

export async function pipeline(inputs: PipelineInputs): Promise<PipelineOutput> {
  const designOutput = await designStep(inputs);
  console.log(designOutput);

  let sourceCode = await codeGenerationStep(designOutput);
  console.log(sourceCode);
  let validationOutput = validate(sourceCode);

  const maxRetries = 5;
  let iterationCount = 0;
  while (!validationOutput.success && iterationCount < maxRetries) {
    const fixedCode = await fixErrorsStep(sourceCode, validationOutput.errors);
    sourceCode = fixedCode;
    iterationCount++;
    console.log(fixedCode);
    validationOutput = validate(fixedCode);
    console.log(validationOutput);
  }
  if (!validationOutput.success) {
    throw new Error('Autofix failed');
  }

  const path = saveGeneratedFile(sourceCode);
  return {
    code: sourceCode,
    path,
  };
}
