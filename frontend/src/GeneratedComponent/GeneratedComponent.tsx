import React from 'react';
import { Box } from '@xtreamsrl/react-ui-kit/Box';
import { Flex } from '@xtreamsrl/react-ui-kit/Flex';
import { Tabs } from '@xtreamsrl/react-ui-kit/Tabs';
import { Typography } from '@xtreamsrl/react-ui-kit/Typography';
import { Icon } from '@xtreamsrl/react-ui-kit/Icon';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Button } from '@xtreamsrl/react-ui-kit';
import ErrorBoundary from '../ErrorBoundary';

type Props = {
  prompt: string;
  Component: React.ComponentType;
  componentCode: string;
  onNewGeneration: () => void;
};


const GeneratedComponent: React.FC<Props> = ({
  prompt,
  Component,
  componentCode,
  onNewGeneration,
}) => {
  const [currentTab, setCurrentTab] = React.useState(0);
  const source = `\`\`\`tsx\n${componentCode}\n\`\`\``;
  return (
    <Flex direction="column" gap="md-2">
      <Flex direction="row" gap="md-2">
        <Typography>{prompt}</Typography>
        <Button onClick={() => onNewGeneration()}>New Component</Button>
      </Flex>
      <Tabs size="sm" currentTab={currentTab} fullWidth onChange={(_, t) => setCurrentTab(t)}>
        <Tabs.Tab icon={<Icon name="Home"/>} value={0}>Result</Tabs.Tab>
        <Tabs.Tab value={1}>Code</Tabs.Tab>
      </Tabs>


      <Tabs.Panel index={0} currentTab={currentTab}>
        <Box>
          <ErrorBoundary>
            {React.createElement(Component)}
          </ErrorBoundary>
        </Box>
      </Tabs.Panel>
      <Tabs.Panel index={1} currentTab={currentTab}>
        <MarkdownPreview source={source} style={{
          textAlign: 'left',
        }}/>
      </Tabs.Panel>
    </Flex>
  );
};

GeneratedComponent.displayName = 'GeneratedComponent';

export default GeneratedComponent;

