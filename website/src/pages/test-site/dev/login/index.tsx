import React from 'react';
import Layout from '@theme/Layout';
import Login, { Account } from '../../components/Login';
import Header from '../../components/Header';
import { ContextProvider } from '../../components/Context'


const accounts: Account[] = [
  {
    username: 'dev_xbell_admin',
    password: 'password123',
    avatar: 'img/xbell-logo.svg'
  },
  {
    username: 'dev_xbell_member',
    password: 'password123',
    avatar: 'img/xbell-logo.svg'
  },
  {
    username: 'dev_pikachu',
    password: 'pikachu123',
    avatar: 'avatar/pikachu.png'
  },
  {
    username: 'dev_psyduck',
    password: 'psyduck123',
    avatar: 'avatar/psyduck.png'

  },
  {
    username: 'dev_super_mario',
    password: 'super_mario123',
    avatar: 'avatar/super_mario.png'
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