import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  src: string;
  description: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'homepage.allInOneTesting',
    src: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/homepage/xbell-mods.svg',
    description: 'homepage.allInOneTesting.desc',
  },
  {
    title: 'homepage.nodeAndBrowser',
    src: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/homepage/xbell-cooperation.svg',
    description: 'homepage.nodeAndBrowser.desc',
  },
  {
    title: 'homepage.decoratorMode',
    src: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/homepage/xbell-decorators.svg',
    description: 'homepage.decoratorMode.desc',
  },
];

function Feature({title, src, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureSvg} role="img" src={src} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3><Translate id={title} /></h3>
        <p><Translate id={description} /></p>
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
