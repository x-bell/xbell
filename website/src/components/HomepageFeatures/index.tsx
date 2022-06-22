import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '多功能装饰器',
    Svg: require('@site/static/img/xbell-decorators.svg').default,
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
    Svg: require('@site/static/img/xbell-mods.svg').default,
    description: (
      <>
        让你像前后端开发一样，通过模块化的方式组织你的用例
      </>
    ),
  },
  {
    title: '协作',
    Svg: require('@site/static/img/xbell-cooperation.svg').default,
    description: (
      <>
        对 bug 自动生成视频录制，快速同步开发 & 产品经理
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
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
