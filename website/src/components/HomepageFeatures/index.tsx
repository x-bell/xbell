import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  src: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Test integration',
    src: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/homepage/xbell-mods.svg',
    description: (
      <>
        Write unit tests and e2e tests with the same mind.
      </>
    ),
  },
  {
    title: 'node & browser',
    src: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/homepage/xbell-cooperation.svg',
    description: (
      <>
        You can freely switch between Node.js and Browser environments to test your code.
      </>
    ),
  },
  {
    title: 'Decorator Mode',
    src: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/homepage/xbell-decorators.svg',
    description: (
      <>
        In decorator mode, you can easily do any test.
      </>
    ),
  },
];

function Feature({title, src, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureSvg} role="img" src={src} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
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
