import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
// import SearchIcon from '@mui/icons-material/Search';
import ThemeSwitch from './ThemeSwitch';
import MDButton from './MDButton';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
    width: '400px',
}));

interface SearchAppBarProps {
  projects: string[];
  activeProject: string;
  onProjectChange(env: string): void;
}

export default function SearchAppBar({
  projects,
  activeProject,
  onProjectChange,
}: SearchAppBarProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="open drawer"
            sx={{ mr: 0 }}
          >
            <NotificationsActiveIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            XBELL
          </Typography>
          <Box style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            {projects.length > 1 && <StyledTabs
              centered
              value={projects.indexOf(activeProject)}
              onChange={(_, v) => onProjectChange(projects[v])}
              indicatorColor="secondary"
              textColor="inherit"
            >
              {projects.map((env) => (
                <Tab key={env} label={env.toLocaleUpperCase()} />
              ))}
            </StyledTabs>
            }
          </Box>
          {/* <MDButton variant="outlined" color="info">
            Coverage
          </MDButton> */}
          <MDButton variant="gradient" color="info" onClick={() => location.href = './coverage/index.html'}>
            Coverage
          </MDButton>
          {/* <MDButton variant="contained" color="info">
            Coverage
          </MDButton> */}
          {/* <ThemeSwitch /> */}
          {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="搜索"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}