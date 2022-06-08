import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import { Context } from '../Context';

export interface HomeProps {
  env: 'dev' | 'prod'
}

const Home: React.FC<HomeProps> = () => {
  const { userInfo } = React.useContext(Context);
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className={styles.root}>
      {userInfo?.username ? <div className={styles.card}>
        <img src={siteConfig.baseUrl + userInfo.avatar} />
      </div> : null}
    </div>
  );
}

export default Home;