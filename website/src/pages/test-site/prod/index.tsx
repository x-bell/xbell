import { ContextProvider } from '@site/src/components/Context';
import React from 'react';
import Redirect from '@site/src/components/Redirect';

export default function HomePage(): JSX.Element {
  return (
    <ContextProvider>
      <Redirect env="prod" />
    </ContextProvider>
  );
}