import React from 'react'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import SearchAppBar from './components/SearchAppBar';
import theme from 'assets/theme';
import { FileCard } from 'components/FileCard';
import AccountBar from 'components/AccountBar';
import { MaterialUIControllerProvider } from './context';
import type { XBellTestProjectRecord } from '../lib/index';
import { getFilesCounter } from './utils/count';

import './App.css'

// @ts-ignore
const XBELL_RESOURCES: XBellTestProjectRecord[] = window.XBELL_RESOURCES;

const ListContainer = styled('div')`
  padding: 40px;
`;
const projects = XBELL_RESOURCES.map(project => project.projectName);

function App() {
  const [activeProject, setActiveProject] = React.useState(projects[0]);
  const activeProjectRecord = XBELL_RESOURCES.find(project => project.projectName === activeProject)!;
  const account = getFilesCounter(activeProjectRecord.files);
  // const [isDark, setIsDark] = React.useState(true);
  return (
    <MaterialUIControllerProvider>
      <ThemeProvider theme={theme}>
        <Stack spacing={2}>
          <SearchAppBar
            projects={projects}
            activeProject={activeProject}
            onProjectChange={setActiveProject}
          />
          <AccountBar
            successedCount={account.successed}
            failedCount={account.failed}
            runningCount={account.running}
          />
          <ListContainer>
            <Stack spacing={2}>
            {activeProjectRecord.files.map((file, index) => (
              <FileCard key={index} {...file} />
            ))}
            </Stack>
          </ListContainer>
        </Stack>
      </ThemeProvider>
    </MaterialUIControllerProvider>
  )
}

export default App
