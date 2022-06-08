import React from 'react';
import { ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { themeOptions } from '../Theme';
import { getEnv } from '../../utils/getEnv';

type UserInfo = {
  username: string;
  avatar: string;
}

type UserInfoWithEnv = UserInfo & {
  env: string;
}

export const Context = React.createContext<{
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

const USER_INFO_KEY = '__user__info__';
export const ContextProvider: React.FC = ({
  children
}) => {
  const [userInfo, rawSetUserInfo] = React.useState<UserInfoWithEnv>(
    safeParseJson(window.localStorage.getItem(USER_INFO_KEY)),
  );
  const setUserInfo = (userInfo: UserInfo) => {
    const env = getEnv()
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
    <ThemeProvider theme={themeOptions}>
      <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
        <Context.Provider value={{ userInfo, setUserInfo, logout }}>
          {children}
        </Context.Provider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
