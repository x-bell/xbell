import React from 'react';
import Layout from '@theme/Layout';
import Login, { Account } from '../../../../components/Login';
import Header from '../../../../components/Header';
import { ContextProvider } from '../../../../components/Context'


const accounts: Account[] = [
  {
    username: 'dev_xbell_admin',
    password: 'password123',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/logo/xbell-logo.svg'
  },
  {
    username: 'dev_xbell_member',
    password: 'password123',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/logo/xbell-logo.svg'
  },
  {
    username: 'dev_pikachu',
    password: 'pikachu123',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/pikachu.png'
  },
  {
    username: 'dev_psyduck',
    password: 'psyduck123',
    avatar: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/test-website/avatar/psyduck.png'

  },
  {
    username: 'dev_super_mario',
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