import LIBRARY_COMPONENTS_METADATA from './data/components.json';
import OpenAI from 'openai';
import { designStep } from './steps/designNewComponent';
import { buildContextStep } from './steps/buildContext';
import { generateNewComponentStep } from './steps/generateNewComponent';
import { saveToFile } from './tools/saveContentToFile';
import path from 'path';
import { removeMD } from './tools/removeMD';
import { PipelineInputs } from './utils';
import { validateComponentStep } from './steps/validationStep';
import { fixErrorsStep } from './steps/fixErrorsStep';

const baseDir = path.join(__dirname, '..', '..', 'frontend', 'src', 'generated');

export async function pipeline(inputs: PipelineInputs) {
  const openai = new OpenAI();
  const libraryComponents = LIBRARY_COMPONENTS_METADATA.map(component => `${component.name} : ${component.description};`).join('\n');

  // Design step
  const designStepInputs = { ...inputs, libraryComponents };
  const designStepOutput = await designStep(openai, designStepInputs);
  if (!designStepOutput) {
    throw new Error('Design step failed');
  }
  console.log(designStepOutput);

  // Context generation step
  const context = buildContextStep(designStepOutput);
  console.log(context);

  // Generation step
  const generateNewComponentStepInputs = { ...context, ...inputs };
  const generationOutput = await generateNewComponentStep(openai, generateNewComponentStepInputs);
  if (!generationOutput) {
    throw new Error('Generation step failed');
  }
  console.log(generationOutput)

  // Validation step
  let sourceCode = removeMD(generationOutput);
  let validationOutput = await validateComponentStep(sourceCode);
  let iterationCount = 0;
  const sourceCodeHistory = [sourceCode];
  const validationHistory = [validationOutput];

  while (!validationOutput.success && iterationCount < 5) {
    console.error('Validation step failed:', validationOutput.errors);
    const fixedSourceCode = await fixErrorsStep(openai, [],{
      sourceCode,
      errors: validationOutput.errors,
      framework: inputs.framework,
    });

    if (!fixedSourceCode) {
      throw new Error('Fix errors step failed');
    }

    sourceCode = removeMD(fixedSourceCode);
    sourceCodeHistory.push(sourceCode);
    validationOutput = await validateComponentStep(sourceCode);
    validationHistory.push(validationOutput);
    iterationCount++;
  }

  if (!validationOutput.success) {
    throw new Error('Validation step failed after 5 attempts');
  } else {
    console.log(`Component generated successfully after ${iterationCount} attempts`);
  }

  // Save to file step
  return saveToFile(baseDir, sourceCode);
}

// Run the pipeline
(async () => {
  await pipeline({
    userDescription: 'User query: "I need a button that changes color when clicked"',
    framework: 'React',
  });
})();
