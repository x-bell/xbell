import { test as basicTest } from 'xbell';
import type { expect } from '@xbell/assert';
import type { Component } from 'vue';
import type { expect as browserExpect } from 'xbell/dist/browser-test';

export const test = basicTest.extendBrowser(async (args) => {
  const { default: Vue } = await import('vue');

  function mount<T extends Component>(C: T, props?: T extends Component<any, any, any, infer P> ? P : any, rootElement?: HTMLElement | string) {
    const ele = typeof rootElement == 'string'
      ? document.querySelector(rootElement)
      : rootElement || document.getElementById('app') || document.getElementById('root');

    if (!ele) {
      throw new Error('root must be a element');
    }
    new Vue({
      render(h) {
        return h(C, {
          props,
        });
      }
    }).$mount(ele);
  }

  return {
    ...args,
    mount,
  }
});
