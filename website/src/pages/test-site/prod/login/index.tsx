import React from 'react';
import Layout from '@theme/Layout';
import Login, { Account } from '../../../../components/Login';
import Header from '../../../../components/Header';
import { ContextProvider } from '../../../../components/Context'


const accounts: Account[] = [
  {
    username: 'xbell_admin',
    password: 'password123',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/logo/xbell-logo.svg'
  },
  {
    username: 'xbell_member',
    password: 'password123',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/logo/xbell-logo.svg'
  },
  {
    username: 'pikachu',
    password: 'pikachu123',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/pikachu.png'
  },
  {
    username: 'psyduck',
    password: 'psyduck123',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/psyduck.png'

  },
  {
    username: 'super_mario',
    password: 'super_mario123',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/super_mario.png'
  },
]

export default function LoginPage(): JSX.Element {
  return (
    <ContextProvider>
      <Header />
      <Login accounts={accounts} />
    </ContextProvider>
  );
}