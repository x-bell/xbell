import React from 'react';
import useBaseUrl from  '@docusaurus/useBaseUrl';
import { Redirect as DRedirect } from '@docusaurus/router';
import Context from '../Context';

type RedirectProps = {
  env: 'dev' | 'prod'
}

const Redirect: React.FC<RedirectProps> = ({
  env
}) => {
  const { userInfo } = React.useContext(Context)
  const targetRoute = userInfo ? 'homepage' : 'login';
  return (
    <DRedirect to={useBaseUrl(`test-site/${env}/${targetRoute}`)} />
  )
}

export default Redirect;
