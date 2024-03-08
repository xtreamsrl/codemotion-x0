import { JSXElementConstructor, useState } from 'react';
import logo from './logo.png';
import './App.css';
import { ThemeProvider } from './theme.tsx';
import { Box } from '@xtreamsrl/react-ui-kit/Box';
import { Button, Flex, TextInput, Typography } from '@xtreamsrl/react-ui-kit';

function App() {

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [Component, setComponent] = useState<JSXElementConstructor<any>>(()=><></>);

  function generate() {
    setLoading(true);
    fetch('http://localhost:8080/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: prompt }),
    }).then(response => response.json()).then(data => {
      return import(`./generated/${data.path}`  /* @vite-ignore */);
    }).then(module => {
      setLoading(false);
      setGenerated(true);
      setComponent(module.default);
    }).catch(error => {
      setLoading(false);
      console.error('Error:', error);
    });
  }

  if (generated && !Component) {
    throw new Error('Component not loaded');
  }

  return (
    <>
      <ThemeProvider>
        {loading && <div>Loading...</div>}
        {!generated ? (
          <Flex direction="column" gap="md-2">
            <Box>
              <img src={logo}/>
            </Box>
            <TextInput label="Prompt" name="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)}/>
            <Button onClick={() => generate()}>Generate</Button>
          </Flex>
        ) : (
          <Flex direction="column" gap="md-2">
            <Typography>{prompt}</Typography>
            <Box>
              <Component />
            </Box>
          </Flex>
        )}

      </ThemeProvider>
    </>
  );
}

export default App;
