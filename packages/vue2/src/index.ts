import { test as basicTest } from 'xbell';
export type {} from '@xbell/assert';
export type {} from '@xbell/snapshot';
import type { Component } from 'vue';
import type { expect as browserExpect } from 'xbell/dist/browser-test';

export { preset } from './preset';

export const test = basicTest.extendBrowser(async (args) => {
  const { default: Vue } = await import('vue');

  function mount<T extends Component>(C: T, props?: T extends Component<any, any, any, infer P> ? P : any, rootElement?: HTMLElement | string) {
    const ele = typeof rootElement == 'string'
      ? document.querySelector(rootElement)
      : rootElement || document.getElementById('app') || document.getElementById('root');

    if (!ele) {
      throw new Error('root must be a element');
    }
    const app = new Vue({
      render(h) {
        return h(C, {
          props,
        });
      }
    });
    app.$mount(ele);
  }

  return {
    ...args,
    mount,
  }
});
