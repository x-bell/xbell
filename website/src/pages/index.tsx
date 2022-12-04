import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Translate, {translate} from '@docusaurus/Translate';
import lottieWeb from 'lottie-web';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const rightRef = React.useRef<HTMLDivElement>();
  const getStartedRef = React.useRef<HTMLDivElement>();
  React.useLayoutEffect(() => {
    const automationLottieItem = lottieWeb.loadAnimation({
      path: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/lottie/automation.json',
      container: rightRef.current,
      loop: true,
      autoplay: true,
      renderer: 'svg'
    });
    const bellLottieItem = lottieWeb.loadAnimation({
      path: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/lottie/bell.json',
      container: getStartedRef.current,
      loop: 1,
      autoplay: true,
      renderer: 'svg',
    });
    return () => {
      automationLottieItem.destroy();
      bellLottieItem.destroy();
    }
  }, [])
  return (
    <header className={clsx(styles.heroBanner)}>
       {/* <div className={styles.fullLogoContainer}>
          <img src="https://raw.githubusercontent.com/x-bell/xbell-assets/main/logo/xbell-512.svg" width={250} height={250} />
        </div> */}
      <div className={clsx(styles.container)}>
        <div className={styles.containerLeft}>
          <div className={styles.title}>
            {siteConfig.title}
          </div>
          <div className={styles.slogan}>
            Make Testing Easy
          </div>
          <div className={styles.description}>
            Let all the code run in a real environment for testing!
          </div>
          <div className={styles.buttons}>
            <Link
              className={clsx('button button--secondary button--lg', styles.getStarted)}
              to="/docs/get-started">
                <Translate id="homepage.getStarted" />
                <div style={{ display: 'inline-block', width: 30, height: 30, marginLeft: 4, }} ref={getStartedRef}></div>
            </Link>
          </div> 
        </div>
        <div className={styles.containerRight}>
          <div ref={rightRef} style={{ width: 350, height: 300 }} />
        </div>
        {/* <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle"><Translate id="xbell.slogan" /></p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/get-started">
              <Translate id="homepage.getStarted" />
          </Link>
        </div> */}
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      description="一款舒适的自动化测试框架">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
