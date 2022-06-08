import React from 'react';
import { AppBar, Container, Typography, Box, MenuItem, Menu, Toolbar, Tooltip, Button, IconButton, Avatar } from '@mui/material';
import Doorbell from '@mui/icons-material/Doorbell'
import MenuIcon from '@mui/icons-material/Menu';
import { useHistory } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Context } from '../Context';



interface HeaderProps {

}

type MenuData = {
  title: string;
  link: string;
}
const pages: MenuData[] = [
  {
    title: '场景',
    link: 'test-site/'
  }
];
const settings = ['退出账号'];

const Header: React.FC<HeaderProps>  = () => {
  const { userInfo, logout } = React.useContext(Context)
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const { siteConfig } = useDocusaurusContext();
  const history = useHistory();

  const avatarUrl = userInfo?.avatar ? siteConfig.baseUrl + userInfo.avatar : undefined;

  console.log('avatarUrl', avatarUrl);
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSettingClick = () => {
    handleCloseUserMenu();
    logout();
  }


  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Doorbell sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/xbell/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            X-BELL
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.title} onClick={() => {
                  handleCloseNavMenu()
                  history.push(siteConfig.baseUrl + page.link)
                }}>
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Doorbell sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            X-BELL
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                onClick={() => {
                  handleCloseNavMenu()
                  history.push(siteConfig.baseUrl + page.link)
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {!!userInfo?.username && <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="个人详情">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="头像" src={avatarUrl} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleSettingClick}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>}
        </Toolbar>
      </Container>
    </AppBar>

  )
}

export default Header;
