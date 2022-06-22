import React from 'react';
import Redirect from '@site/src/components/Redirect';
import { ContextProvider } from '@site/src/components/Context';

export default function HomePage(): JSX.Element {
  return (
    <ContextProvider>
      <Redirect env="dev" />
    </ContextProvider>
  );
}
