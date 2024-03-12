import LIBRARY_COMPONENTS_METADATA from './data/components.json';
import OpenAI from 'openai';
import { designStep } from './steps/designNewComponent';
import { buildContextStep } from './steps/buildContext';
import { generateNewComponentStep } from './steps/generateNewComponent';
import path from 'path';
import { validateComponentStep } from './steps/validationStep';
import { fixErrorsStep } from './steps/fixErrorsStep';
import { logStepData, PipelineInputs, removeMD, saveToFile } from './utils';
import { v4 as uuid } from 'uuid';

const baseDir = path.join(__dirname, '..', '..', 'frontend', 'src', 'generated');

export async function pipeline(inputs: PipelineInputs) {
  const executionId = uuid();
  console.log(`Pipeline started with execution id: ${executionId}`);
  const openai = new OpenAI();

  // Design step
  const libraryComponents = LIBRARY_COMPONENTS_METADATA.map(component => `${component.name} : ${component.description};`).join('\n');
  const designStepInputs = { ...inputs, libraryComponents };
  const designStepOutput = await designStep(openai, designStepInputs);
  if (!designStepOutput) {
    throw new Error('Design step failed');
  }
  logStepData(executionId, 'design', designStepInputs, designStepOutput);

  // Context generation step
  const context = buildContextStep(designStepOutput);
  logStepData(executionId, 'context', designStepOutput, context);

  // Generation step
  const generateNewComponentStepInputs = { ...context, ...inputs };
  const generationOutput = await generateNewComponentStep(openai, generateNewComponentStepInputs);
  if (!generationOutput) {
    throw new Error('Generation step failed');
  }
  logStepData(executionId, 'generation', generateNewComponentStepInputs, generationOutput);

  // Validation step
  let sourceCode = removeMD(generationOutput);
  let validationOutput = await validateComponentStep(sourceCode);
  let iterationCount = 0;
  logStepData(executionId, `validation-${iterationCount}`, sourceCode, validationOutput);

  while (!validationOutput.success && iterationCount < 5) {
    const fixedSourceCode = await fixErrorsStep(openai, [], {
      sourceCode,
      errors: validationOutput.errors,
      framework: inputs.framework,
    });

    if (!fixedSourceCode) {
      console.error('Fix errors step failed');
      continue;
    }
    logStepData(executionId, `fix-errors-${iterationCount}`, {
      sourceCode,
      errors: validationOutput.errors,
      framework: inputs.framework,
    }, fixedSourceCode);

    sourceCode = removeMD(fixedSourceCode);
    validationOutput = await validateComponentStep(sourceCode);
    logStepData(executionId, `validation-${iterationCount}`, sourceCode, validationOutput);
    iterationCount++;
  }

  if (!validationOutput.success) {
    throw new Error('Validation step failed after 5 attempts');
  } else {
    console.log(`Component generated successfully after ${iterationCount} fix attempt ${'s' ? iterationCount > 1 : ''}`);
  }

  // Save to file step
  const fileName = saveToFile(baseDir, executionId, sourceCode);
  console.log(fileName);
  return fileName;
}
