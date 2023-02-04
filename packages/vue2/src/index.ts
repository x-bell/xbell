import { test as basicTest } from 'xbell';
import type { Locator } from 'xbell';
export type { } from '@xbell/assert';
export type { } from '@xbell/snapshot';
import type { CreateElement, VNodeData, VNode } from 'vue';

export const test = basicTest.extendBrowser(async (args) => {
  const { default: Vue, reactive } = await import('vue');

  function getXPath(element: Element): string {
    if (element.tagName == 'HTML')
      return '//html[1]';
    if (element === document.body)
      return '//html[1]/body[1]';

    const siblings = element.parentNode!.childNodes;
    let ix = 0;
    for (let i = 0; i < siblings.length; i++) {
      const sibling = siblings[i];
      if (sibling === element)
        return getXPath(element.parentNode as Element) + (element.tagName ? '/' + element.tagName.toLocaleLowerCase() + '[' + (ix + 1) + ']' : '');
      if (sibling.nodeType === 1 && (sibling as Element).tagName === element.tagName)
        ix++;
    }

    throw new Error('Get xpath failed');
  }

  function mount(
    Comp: Parameters<CreateElement>[0],
    { props: initialProps, slots, events, container }: {
        props?: VNodeData['props'];
        slots?: VNodeData['scopedSlots'];
        events?: VNodeData['on'];
        container?: Element | 'string';
    } = {},
) {
    const rootEle =
        typeof container == 'string'
            ? document.querySelector(container)
            : container || document.getElementById('app') || document.getElementById('root');

    if (!rootEle) {
        throw new Error('Container must be a element');
    }
    const props = reactive(initialProps || {});
    const vm = new Vue({
        render(h) {
            return h(Comp, {
                on: events,
                scopedSlots: slots,
                props,
            });
        },
    });

    vm.$mount(rootEle);

    const xpath = getXPath(vm.$el)

    const locator = args.page.get(`xpath=${xpath}`);

    return {
        component: {
            setProps(newProps: Record<string, unknown>) {
                for (const [k, v] of Object.entries(newProps)) {
                    props[k] = v;
                }
                return vm.$nextTick();
            },
        },
        locator,
    };
}

  return {
    ...args,
    mount,
  }
});
