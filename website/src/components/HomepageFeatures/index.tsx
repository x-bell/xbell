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
    title: '多功能装饰器',
    src: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/homepage/xbell-decorators.svg',
    description: (
      <>
        在这，你几乎能通过装饰器干一切事
        <br />
        例如：通过装饰器声明每个用例的断言，使断言一目了然
      </>
    ),
  },
  {
    title: 'POM & 模块化',
    src: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/homepage/xbell-mods.svg',
    description: (
      <>
        让你像前后端开发一样，通过模块化的方式组织你的用例
      </>
    ),
  },
  {
    title: '协作',
    src: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/homepage/xbell-cooperation.svg',
    description: (
      <>
        对 bug 自动生成视频录制，快速同步开发 & 产品经理
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
