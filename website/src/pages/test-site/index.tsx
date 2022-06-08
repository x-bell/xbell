import React from 'react';
import Layout from '@theme/Layout';
import Header from './components/Header';
import { ContextProvider } from './components/Context';
import clsx from 'clsx';
import { useHistory } from '@docusaurus/router';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Paper } from '@mui/material';
import styles from './index.module.css';

const cases = [
  {
    imgUrl: 'img/connection.png',
    title: '多套数据环境',
    link: 'test-site/dev'
  },
  {
    imgUrl: 'img/todo-list.png',
    title: '更多场景...',
    disabled: true,
  }
]

export default function TestSite(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const history = useHistory();
  return (
    <ContextProvider>
      <Header />
      <div className={styles.cardList}>
        {cases.map(({ imgUrl, title, disabled, link }, idx) => {
          return (
            <div className={clsx(styles.card, { [styles.cardDisabled]: disabled })} key={idx} onClick={() => link && history.push(siteConfig.baseUrl + link)}>
            <Paper elevation={3} className={styles.cardInner}>
              <img width={100} src={siteConfig.baseUrl + imgUrl} />
              <div className={styles.cardTitle}>
                {title}
              </div>
            </Paper>
          </div>
          )
        })}
      </div>
    </ContextProvider>
  );
}