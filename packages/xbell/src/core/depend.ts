import { container } from './container';
import { PropertyKey } from '../types';
import { MultiEnvData } from '../../src';

export function Depend<G, K  extends keyof G>(
  group: new () => G,
  targetPropertyKey: K,
): MethodDecorator;

export function Depend<G, K  extends keyof G>(
  group: new () => G,
  targetPropertyKey: K,
  ...params: G[K] extends (...args: any) => any ? (
    [
      Parameters<G[K]>[0] | MultiEnvData<Parameters<G[K]>[0]>,
    ]
   ) : any
): MethodDecorator;

export function Depend<G, K  extends keyof G>(
  group: new () => G,
  targetPropertyKey: K,
  ...params: G[K] extends (...args: any) => any ? (
    [
      Parameters<G[K]>[0] | MultiEnvData<Parameters<G[K]>[0]>,
      Parameters<G[K]>[1] | MultiEnvData<Parameters<G[K]>[1]>,
    ]
   ) : any
): MethodDecorator;

export function Depend<G, K  extends keyof G>(
  group: new () => G,
  targetPropertyKey: K,
  ...params: G[K] extends (...args: any) => any ? (
    [
      Parameters<G[K]>[0] | MultiEnvData<Parameters<G[K]>[0]>,
      Parameters<G[K]>[1] | MultiEnvData<Parameters<G[K]>[1]>,
      Parameters<G[K]>[2] | MultiEnvData<Parameters<G[K]>[2]>,
    ]
   ) : any
): MethodDecorator;

export function Depend<G, K  extends keyof G>(
  group: new () => G,
  targetPropertyKey: K,
  ...params: G[K] extends (...args: any) => any ? (
    [
      Parameters<G[K]>[0] | MultiEnvData<Parameters<G[K]>[0]>,
      Parameters<G[K]>[1] | MultiEnvData<Parameters<G[K]>[1]>,
      Parameters<G[K]>[2] | MultiEnvData<Parameters<G[K]>[2]>,
      Parameters<G[K]>[3] | MultiEnvData<Parameters<G[K]>[3]>,
    ]
   ) : any
): MethodDecorator {
  return (target, methodKey) => {
    container.addDepend(target.constructor, methodKey, group, targetPropertyKey as PropertyKey, params);
  };
}

