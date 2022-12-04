import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';
import lottieWeb from 'lottie-web';
import type { AnimationItem } from 'lottie-web';
type FeatureItem = {
  title: string;
  // src: string;
  data: any;
  description: string;
  scale?: number;
  speed?: number;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'homepage.realRuntime',
    data: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/lottie/runtime.json',
    description: 'homepage.realRuntime.desc',
    speed: 0.5
  },
  {
    title: 'homepage.snapshots',
    data: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/lottie/camera.json',
    description: 'homepage.snapshots.desc',
  },
  {
    title: 'homepage.allInOneTesting',
    data: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/lottie/all-in-one.json',
    description: 'homepage.allInOneTesting.desc',
  },
  {
    title: 'homepage.outOfBox',
    data: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/lottie/out-of-box.json',
    description: 'homepage.outOfBox.desc',
    scale: 1.6,
  },
];

function Feature({title, data, scale, description, speed}: FeatureItem) {
  const iconRef = React.useRef<HTMLDivElement>();
  React.useLayoutEffect(() => {
    if (!data) return;
    const lottieItem = lottieWeb.loadAnimation({
      renderer: 'svg',
      path: data,
      loop: 5,
      autoplay: true,
      container: iconRef.current,
    });

    if (speed) {
      lottieItem.setSpeed(speed)
    }

    return () => {
      lottieItem.destroy();
    }
  }, []);

  return (
    <div className={clsx('col col--3')}>
      {/* <div className="text--center">
        <img className={styles.featureSvg} role="img" src={src} />
      </div> */}
      <div className="text--center padding-horiz--md">
        <div ref={iconRef} style={{ width: 30, height: 30, display: 'inline-block', transform: `scale(${scale})`, }} />
        <h3><Translate id={title} /></h3>
        <p style={{ color: '#666' }}><Translate id={description} /></p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
