import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

(async () => {
  const model = new ChatOpenAI({});
  const promptTemplate = PromptTemplate.fromTemplate(
    "Tell me a joke about {topic}"
  );
  const outputParser = new StringOutputParser();
  const chain = promptTemplate.pipe(model).pipe(outputParser);
  const result = await chain.invoke({ topic: "bears" });
  console.log(result);
})()
