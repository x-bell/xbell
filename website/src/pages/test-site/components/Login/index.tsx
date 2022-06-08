import React from 'react';
import { Button, Container, TextField, FormControlLabel, Checkbox, Box, Avatar, Typography, Snackbar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { VariantType, useSnackbar } from 'notistack';
import { useHistory } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Context } from '../Context';
import { getEnv } from '../../utils/getEnv';


export type Account = {
  username: string;
  password: string
  avatar: string;
}

interface LoginProps {
  accounts: Account[]
}

const snackbarAnchorOrigin =  {
  vertical: 'top',
  horizontal: 'center'
} as const;
const Login: React.FC<LoginProps> = ({
  accounts
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { siteConfig } = useDocusaurusContext();
  const context = React.useContext(Context)
  const history = useHistory();
  const [ account, setAccount ] = React.useState<Omit<Account, 'avatar'>>({ username: '', password: '' })
  const showMessage = (message: string, variant: VariantType) => {
    enqueueSnackbar(message, { variant, anchorOrigin: snackbarAnchorOrigin });
  };

  const handleSubmit = () => {
    const targetAccount = accounts?.find(validAccount => validAccount.username === account.username && validAccount.password === account.password)
    console.log('account', account);
    if (targetAccount) {
      showMessage('登录成功', 'success');
      setTimeout(() => {
        const { password, ...userInfo  } = targetAccount;
        context.setUserInfo(userInfo);
        history.push(siteConfig.baseUrl + 'test-site/' + getEnv());
      }, 500);
    } else {
      showMessage('账号或密码错误', 'error');
    }
  }


  return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon color="inherit" />
          </Avatar>
          <Typography component="h1" variant="h5">
            登录
          </Typography>
          <Box>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="用户名"
              name="username"
              autoComplete="username"
              autoFocus
              value={account.username}
              onChange={(e) => setAccount({ ...account, username: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密码"
              type="password"
              id="password"
              autoComplete="current-password"
              value={account.password}
              onChange={(e) => setAccount({ ...account, password: e.target.value })}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="记住密码"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              // color="inherit"
              sx={{ mt: 3, mb: 2 }}
            >
              登录
            </Button>
          </Box>
        </Box>
        {/* <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          message="I love snacks"
          key={vertical + horizontal}
        /> */}
      </Container>
  )
}

export default Login;
