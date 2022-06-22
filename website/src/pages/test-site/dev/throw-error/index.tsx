import React from 'react';
import Header from '@site/src/components/Header';
import { ContextProvider } from '@site/src/components/Context';
import ThrowError from '@site/src/components/ThrowError';

const ThrowErrorPage: React.FC = () => {
  return (
    <ContextProvider>
      <Header />
      <ThrowError />
    </ContextProvider>
  );
}

export default ThrowErrorPage;
