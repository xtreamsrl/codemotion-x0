import OpenAI from 'openai';

async function getChatCompletion(messages: {
  role: 'user' | 'system';
  content: string
}[]) {
  const client = new OpenAI();
  return client.chat.completions.create({
    messages: messages,
    model: 'gpt-4-turbo-preview',
    tools: [
      {
        type: 'function',
        function: {
          name: 'getCurrentWeather',
          description: 'Get the current weather',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The city and state, e.g. San Francisco, CA',
              },
              format: {
                type: 'string',
                enum: ['celsius', 'fahrenheit'],
                description: 'The temperature unit to use. Infer this from the users location.',
              },
              language: {
                type: 'string',
                description: 'The language of the user. Infer this from the users messages.',
              },
            },
            required: ['location', 'format', 'language'],
          },
        },
      },
    ],
    tool_choice: { type: 'function', function: { name: 'getCurrentWeather' } }, // forces the model to use the tool
  });
}

const messages = [
  { role: 'system' as const, content: 'You are a helpful assistant.' },
  { role: 'user' as const, content: 'What is the weather like in Milan today?' },
];

getChatCompletion(messages).then(response => {
  const toolResult = response.choices[0].message?.tool_calls?.[0].function.arguments;
  console.log(toolResult);
});
