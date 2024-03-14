async function getChatCompletion(messages: ReadonlyArray<{
  role: 'assistant' | 'user' | 'system';
  content: string;
}>) {
  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages: messages,
    }),
  }).then(response => response.json())
    .then(data => data.choices[0].message.content);
}

const messages = [
  { role: 'system', content: "You are a helpful assistant." },
  { role: 'user', content: 'What is Codemotion?' },
  { role: 'assistant', content: 'Codemotion is one of the largest tech conferences in Europe, primarily focused on software development and emerging technologies.' },
  { role: 'user', content: 'When was it founded?' },
  { role: 'assistant', content: 'Codemotion was founded in 2011 by Chiara Russo and Mara Marzocchi.' },
  { role: 'user', content: 'Where do the Codemotion conferences take place?' }
] as const;

getChatCompletion(messages).then(console.log);
