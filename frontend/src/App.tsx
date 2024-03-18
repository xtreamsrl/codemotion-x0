import React, { JSXElementConstructor, Suspense, useState } from 'react';
import logox from './logo-blu_new_green.svg';
import logoc from './codemotion-wf.svg';
import './App.css';
import { ThemeProvider } from './theme.tsx';
import { Box } from '@xtreamsrl/react-ui-kit/Box';
import { Button, Flex, TextInput } from '@xtreamsrl/react-ui-kit';
import GeneratedComponent from './GeneratedComponent';

function App() {

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [Component, setComponent] = useState<JSXElementConstructor<any>>(() => <></>);
  const [componentCode, setComponentCode] = useState<string>('');

  function generate() {
    setLoading(true);
    fetch('http://localhost:8080/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: prompt }),
    }).then(response => response.json()).then(data => {
      setTimeout(() => {
        setLoading(false);
        setGenerated(true);
        console.log('path:', `./generated/${data.path}`);
        setComponent(React.lazy(() => import(`./generated/${data.path}`  /* @vite-ignore */)));
        setComponentCode(data.code);
      }, 1000);

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
        {!generated ? (
          <Flex direction="column" gap="md-2">
            <Flex direction="column" alignItems="center" gap="sm-8">
              <Box width="30%">
                <img style={{ width: '100%' }} src={logox}/>
              </Box>
              <Box>FOR</Box>
              <Box width="60%">
                <img style={{ width: '100%' }} src={logoc}/>
              </Box>
            </Flex>
            <TextInput label="Prompt" name="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)}/>
            <Button loading={loading} onClick={() => generate()}>Generate</Button>
          </Flex>
        ) : (

          <GeneratedComponent prompt={prompt} Component={Component} componentCode={componentCode}
                              onNewGeneration={() => {
                                setGenerated(false);
                                setComponent(() => <></>);
                                setPrompt('');
                              }}/>
        )}

      </ThemeProvider>
    </Suspense>
  );
}

export default App;
