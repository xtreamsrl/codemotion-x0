async function getChatCompletion(messages: ReadonlyArray<{
  role: 'assistant' | 'user' | 'system' | 'function';
  content: string
}>) {
  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
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
                  description: 'The language of the user. Infer this from the users messages.'
                }
              },
              required: ['location', 'format', 'language'],
            },
          },
        },
      ],
      tool_choice: { type: 'function', function: { name: 'getCurrentWeather' } }, // forces the model to use the tool
    }),
  }).then(response => response.json());
}

const messages = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'What is the weather like in Milan today?' },
] as const;

getChatCompletion(messages).then(response => {
  const toolResult = response.choices[0].message?.tool_calls?.[0].function.arguments;
  console.log(toolResult);
});
