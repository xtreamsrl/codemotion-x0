import { designStep } from './steps/designNewComponent';
import LIBRARY_COMPONENTS from './data/components.json';
import { RunnableSequence } from '@langchain/core/runnables';
import { buildContextStep } from './steps/buildContext';
import { generateNewComponentStep } from './steps/generateNewComponent';
import * as path from 'path';
import { SaveContentToFile } from './tools/saveContentToFile';

(async () => {
  const libraryComponents = LIBRARY_COMPONENTS.map(component => `${component.name} : ${component.description};`).join('\n');

  const pipeline = RunnableSequence.from([
    designStep(),
    buildContextStep(),
    generateNewComponentStep(),
    new SaveContentToFile(path.join(__dirname, 'tmp')),
  ]);

  const filePath = await pipeline.invoke({
    userDescription: 'A simple card with a text and a button with the text "Works?" which is clickable and triggers an alert with the text "It works!"',
    libraryComponents,
    framework: 'React',
  });

  console.log(filePath);
})();
