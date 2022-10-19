import { test as basicTest } from 'xbell';
import type { Component } from 'vue';

export const test = basicTest.extendBrowser(async () => {
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
    mount,
  }
});
