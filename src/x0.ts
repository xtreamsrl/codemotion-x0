import { ChatOpenAI } from "@langchain/openai";
import { designStep } from './steps/designNewComponent';
import LIBRARY_COMPONENTS from './data/xtream-ui-kit/components.json';
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables';

(async () => {
  const libraryComponents = LIBRARY_COMPONENTS.map(component => `${component.name} : ${component.description};`).join('\n');

  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    streaming: true,
  });

  const pipeline = RunnableSequence.from([
    new RunnablePassthrough(),
    designStep(model),
  ])
  const result = await pipeline.invoke({ userDescription: 'A simple card with a text and a button', libraryComponents, framework: 'React' })

  console.log(result);
})();
