import React from 'react';
import { ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import theme from '../../utils/theme';
import { useLocation } from '@docusaurus/router';
import BrowserOnly from '@docusaurus/BrowserOnly';
import getEnv from '../../utils/getEnv';

type UserInfo = {
  username: string;
  avatar: string;
}

type UserInfoWithEnv = UserInfo & {
  env: string;
}

const Context = React.createContext<{
  userInfo?: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
  logout(): void;
}>({
  userInfo: null,
  setUserInfo() {},
  logout() {},
})

function safeParseJson(v: any) {
  try {
    return JSON.parse(v)
  } catch(_) {
    return null;
  }
}

export default Context;

const USER_INFO_KEY = '__user__info__';
const ContextProviderImp: React.FC = ({
  children
}) => {
  const location = useLocation();
  const env = getEnv(location.pathname);
  const localUserInfo = React.useMemo(() => safeParseJson(window.localStorage.getItem(USER_INFO_KEY)), []);
  const [userInfo, rawSetUserInfo] = React.useState<UserInfoWithEnv>(
    localUserInfo?.env === env ? localUserInfo : null
  );
  const setUserInfo = (userInfo: UserInfo) => {
  
    if (env) {
      const userInfoWithEnv: UserInfoWithEnv = {
        ...userInfo,
        env
      }
      rawSetUserInfo(userInfoWithEnv);
      console.log('userInfoWithEnv', userInfoWithEnv);
      window.localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfoWithEnv));
    }
  }

  const logout = () => {
    window.localStorage.removeItem(USER_INFO_KEY)
    setUserInfo(null);
  }
  return (
    <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
          <Context.Provider value={{ userInfo, setUserInfo, logout }}>
            {children}
          </Context.Provider>
        </SnackbarProvider>
    </ThemeProvider>
  );
}

export const ContextProvider: React.FC = ({
  children
}) => {
  return (
    <BrowserOnly>
      {() => <ContextProviderImp>{children}</ContextProviderImp>}
    </BrowserOnly>
  )
}