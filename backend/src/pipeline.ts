import LIBRARY_COMPONENTS_METADATA from './data/components.json';
import OpenAI from 'openai';
import { designStep } from './steps/designNewComponent';
import { buildContextStep } from './steps/buildContext';
import { generateNewComponentStep } from './steps/generateNewComponent';
import { saveToFile } from './tools/saveContentToFile';
import path from 'path';
import { removeMD } from './tools/removeMD';
import { PipelineInputs } from './utils';

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

  // Save to file step
  const content = removeMD(generationOutput);
  const fileName= saveToFile(baseDir, content);

  // todo : validation step

  return fileName;
}

// Run the pipeline
(async () => {
  await pipeline({
    userDescription: 'User query: "I need a button that changes color when clicked"',
    framework: 'React',
  });
})();
