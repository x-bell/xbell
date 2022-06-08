import React from 'react';
import Layout from '@theme/Layout';
import Header from '../components/Header';
import Home from '../components/Home';
import { ContextProvider } from '../components/Context'

export default function HomePage(): JSX.Element {
  return (
    <ContextProvider>
      <Header />
      <Home env="prod" />
    </ContextProvider>
  );
}