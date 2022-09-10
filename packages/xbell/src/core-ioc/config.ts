import { XBellConfig } from '../types/config';
import { container } from './container';

type Config = (config: Partial<XBellConfig>) => any;

export const Config: (config: Partial<XBellConfig>) => any = (xbellConfig: Partial<XBellConfig>) => {
  return (target: any, propertyKey: any) => {
    const isClassDecorator = target?.constructor === Function;
    if (isClassDecorator) {
      container.addClassConfig(target, xbellConfig);
    } else {
      container.addMethodConfig(target.constructor, propertyKey, xbellConfig);
    }
  }
}



export const Viewport = (viewport: XBellConfig['viewport']) => {
  return Config({ viewport });
}

export const RunEnvs = (envs: XBellConfig['envs']) => {
  return Config({ envs });
}

export const Headless = (headless = true) => {
  return Config({ headless });
}

export const RunBrowsers = (browsers: XBellConfig['browsers']) => {
  return Config({ browsers });
}
