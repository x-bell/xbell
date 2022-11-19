import { expect as basic, defineMatcher, getAssertionMessage } from '@xbell/assert';
import type { ExpectMatchState } from '@xbell/assert';
import type { Locator, ElementHandle, CommonPage } from '../types';
import type { ToMatchImageSnapshotOptions, ToMatchJavaScriptSnapshotOptions } from '@xbell/snapshot';
import { e2eMatcher } from '../worker/expect/matcher'

type E2EMatcher = typeof e2eMatcher;

type BrowserE2EMatcher = {
  [K in keyof E2EMatcher]: E2EMatcher[K] extends (...args: infer Args) => (state: ExpectMatchState) => Promise<{
    pass: boolean;
    message: () => string;
  }> ? (...args: Args) => (state: ExpectMatchState) => Promise<{
    pass: boolean;
    message: string;
  }> : E2EMatcher[K];
}

const browserE2EMatcher = defineMatcher<BrowserE2EMatcher>({
  toBeChecked(target, ...args) {
    return async (state) => {
      return window.__xbell_page_expect__({
        // @ts-ignore
        type: target._type,
        // @ts-ignore
        uuid: target._uuid,
        method: 'toBeChecked',
        args,
        state,
      });
    }
  },
  toBeDisabled(target, ...args) {
    return async (state) => {
      return window.__xbell_page_expect__({
        // @ts-ignore
        type: target._type,
        // @ts-ignore
        uuid: target._uuid,
        method: 'toBeDisabled',
        args,
        state,
      });
    }
  },
  toBeHidden(target, ...args) {
    return async (state) => {
      return window.__xbell_page_expect__({
        // @ts-ignore
        type: target._type,
        // @ts-ignore
        uuid: target._uuid,
        method: 'toBeHidden',
        args,
        state,
      });
    }
  },
  toBeVisible(target, ...args) {
    return async (state) => {
      return window.__xbell_page_expect__({
        // @ts-ignore
        type: target._type,
        // @ts-ignore
        uuid: target._uuid,
        method: 'toBeVisible',
        args,
        state,
      });
    }
  },
  toMatchImageScreenshot(target, ...args) {
    return async (state) => {
      return window.__xbell_page_expect__({
        target,
        method: 'toMatchImageScreenshot',
        args,
        state,
      });
    }
  },
  toMatchScreenshot(target, ...args) {
    return async (state) => {
      return window.__xbell_page_expect__({
        // @ts-ignore
        type: target._type,
        // @ts-ignore
        uuid: target._uuid,
        method: 'toMatchScreenshot',
        args,
        state,
      });
    }
  },
  toMatchSnapshot(target, ...args) {
    return async (state) => {
      return window.__xbell_page_expect__({
        target,
        method: 'toMatchSnapshot',
        args,
        state,
      });
    }
  },
  toThrowErrorMatchingSnapshot(received: Function | Error, ...args) {
    return async (state) => {
      // const validOpts: ToMatchJavaScriptSnapshotOptions = typeof options === 'string' ? { name: options } : options;
      let err: any;
      let isThrow = false;
      try {
        if (state.rejects) {
          isThrow = true;
          err = received as Error;
        } else {
          (received as Function)();
        }
      } catch (e) {
        isThrow = true;
        err = e;
      }

      if (!isThrow) {
        return {
          pass: false,
          message: getAssertionMessage({
            ...state,
            assertionName: 'toThrowErrorMatchingSnapshot',
            ignoreExpected: true,
            ignoreReceived: true,
          }),
        };
      }

      return window.__xbell_page_expect__({
        target: err,
        method: 'toThrowErrorMatchingSnapshot',
        args,
        state,
      });
      // return matchJavaScriptSnapshot({
      //   ...state,
      //   value: state.rejects ? (received as unknown as Error)?.message : err.message,
      //   options: validOpts,
      //   projectName,
      //   filepath,
      // });
    }
  },
});

export const expect = basic.extend(browserE2EMatcher);
