import React, { JSXElementConstructor, Suspense, useEffect, useState } from 'react';
import logo from './logo.png';
import './App.css';
import { ThemeProvider } from './theme.tsx';
import { Box } from '@xtreamsrl/react-ui-kit/Box';
import { Button, Flex, TextInput, Typography } from '@xtreamsrl/react-ui-kit';
import A from './generated/5db2e0ff-0012-49a0-9c2e-1da46aafa74b.tsx';

function App() {

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [Component, setComponent] = useState<JSXElementConstructor<any>>(() => <></>);

  function generate() {
    setLoading(true);
    fetch('http://localhost:8080/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: prompt }),
    }).then(response => response.json()).then(data => {
      setLoading(false);
      setGenerated(true);
      setComponent(React.lazy(() => import(`./generated/${data.path}`)));
    }).catch(error => {
      setLoading(false);
      console.error('Error:', error);
    });
  }

  if (generated && !Component) {
    throw new Error('Component not loaded');
  }

  return (
    <Suspense>
      <ThemeProvider>
        <A/>
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
              {React.createElement(Component)}
            </Box>
          </Flex>
        )}

      </ThemeProvider>
    </Suspense>
  );
}

export default App;
