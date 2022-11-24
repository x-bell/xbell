import { test as basicTest } from 'xbell';
import type { Locator } from 'xbell';
export type { } from '@xbell/assert';
export type { } from '@xbell/snapshot';
import type { CreateElement, VNodeData } from 'vue';
import type { expect as browserExpect } from 'xbell/dist/browser-test';

export { preset } from './preset';

export const test = basicTest.extendBrowser(async (args) => {
  const Vue = await import('vue');

  function getXPath(element: Element): string {
    if (element.tagName == 'HTML')
      return '//html[1]';
    if (element === document.body)
      return '//html[1]/body[1]';

    let ix = 0;
    const siblings = element.parentNode!.childNodes;
    for (var i = 0; i < siblings.length; i++) {
      var sibling = siblings[i];
      if (sibling === element)
        return getXPath(element.parentNode as Element) + '/' + element.tagName.toLocaleLowerCase() + '[' + (ix + 1) + ']';
      if (sibling.nodeType === 1 && (sibling as Element).tagName === element.tagName)
        ix++;
    }

    throw new Error('Get xpath error');
  }

  function mount(Comp: Parameters<CreateElement>[0], data: VNodeData, rootElement?: HTMLElement | string): Locator {
    const ele = typeof rootElement == 'string'
      ? document.querySelector(rootElement)
      : rootElement || document.getElementById('app') || document.getElementById('root');

    if (!ele) {
      throw new Error('root must be a element');
    }

    const app = new Vue.default({
      render(h) {
        return h(Comp, data);
      }
    });
    app.$mount(ele);
    const xpath = getXPath(app.$el)

    return args.page.get(`xpath=${xpath}`);
  }

  return {
    ...args,
    mount,
  }
});
