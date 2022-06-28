import React from 'react';
import { Paper, Fab, Button } from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useHistory } from '@docusaurus/router';
import styles from './index.module.css';
import Context from '../Context';

export interface HomeProps {
  env: 'dev' | 'prod'
}

const Home: React.FC<HomeProps> = ({
  env
}) => {
  const { userInfo } = React.useContext(Context);
  const { siteConfig } = useDocusaurusContext();
  const history = useHistory();

  const handleLoginClick = () => {
    history.push(siteConfig.baseUrl + 'test-site/' + env + '/login');
  }
  return (
    <div className={styles.root}>
      {userInfo?.username ?
      <div className={styles.card}>
          <Paper className={styles.avatar}>
            <img width={250} src={siteConfig.baseUrl + userInfo.avatar} />
          </Paper>
          <div className={styles.username}>
            {userInfo.username}
          </div>
      </div> : <div className={styles.card}>
          <img  width={250} src="https://raw.githubusercontent.com/x-bell/xbell-assets/main/logo/xbell.svg" />
          <Button size="large" color="primary" startIcon={<FingerprintIcon />} onClick={handleLoginClick}>
            去登录
          </Button>
        </div>}
    </div>
  );
}

export default Home;