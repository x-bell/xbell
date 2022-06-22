import React from 'react'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import SearchAppBar from './components/SearchAppBar';
import theme from 'assets/theme';
import GroupCard from 'components/GroupCard';
import AccountBar from 'components/AccountBar';
import { MaterialUIControllerProvider } from './context';
import { XBellReportResources } from '../lib/index';

import './App.css'

// @ts-ignore
const XBELL_RESOURCES: XBellReportResources = window.XBELL_RESOURCES;

const ListContainer = styled('div')`
  padding: 40px;
`;
const envs = Object.keys(XBELL_RESOURCES);

function App() {
  const [activeEnv, setActiveEnv] = React.useState(envs[0]);
  const account = XBELL_RESOURCES[activeEnv].reduce((acc, { cases }) => {
    cases.forEach((c) => {
      if (c.status === 'failed') {
        acc.failed++;
      } else if (c.status === 'successed') {
        acc.successed++;
      } else if (c.status === 'running') {
        acc.running++;
      }
    })
    return acc;
  }, {
    successed: 0,
    failed: 0,
    running: 0,
  });
  // const [isDark, setIsDark] = React.useState(true);
  return (
    <MaterialUIControllerProvider>
      <ThemeProvider theme={theme}>
        <Stack spacing={2}>
          <SearchAppBar
            envs={envs}
            activeEnv={activeEnv}
            onEnvChange={setActiveEnv}
          />
          <AccountBar
            successedCount={account.successed}
            failedCount={account.failed}
            runningCount={account.running}
          />
          <ListContainer>
            <Stack spacing={2}>
            {XBELL_RESOURCES[activeEnv].map((group, index) => (
              <GroupCard key={index} {...group} />
            ))}
            </Stack>
          </ListContainer>
        </Stack>
      </ThemeProvider>
    </MaterialUIControllerProvider>
  )
}

export default App
