import type { ToMatchImageSnapshotOptions, ToMatchJavaScriptSnapshotOptions } from '@xbell/snapshot';
import type { Locator, ElementHandle, Page } from '../../types';
import type { TimeoutOptions } from '../../types/pw';
import { matchImageSnapshot, matchJavaScriptSnapshot } from '@xbell/snapshot';
import { defineMatcher, getAssertionMessage } from '@xbell/assert';
import { stateManager } from '../state-manager';
import debug from 'debug';

const debugMatcher = debug('xbell:matcher');
export const elementMatcher = defineMatcher({
  async toBeChecked(received: Locator | ElementHandle, options?: TimeoutOptions) {
    const pass = await received.isChecked(options);
    return {
      pass,
      message: state => getAssertionMessage({
        ...state,
        assertionName: 'toBeChecked',
        ignoreExpected: true,
        // additionalMessage: '',
      })
    };
  },
  async toBeDisabled(received: Locator | ElementHandle, options?: TimeoutOptions) {
    const pass = await received.isDisabled(options);
    return {
      pass,
      message: state => getAssertionMessage({
        ...state,
        assertionName: 'toBeDisabled',
        ignoreExpected: true,
        // additionalMessage: '',
      }),
    }
  },
  async toBeVisible(received: Locator | ElementHandle, options?: TimeoutOptions) {
    const pass = await received.isVisible(options);
    return {
      pass,
      message: state => getAssertionMessage({
        ...state,
        assertionName: 'toBeVisible',
        ignoreExpected: true,
        // additionalMessage: '',
      })
    }
  },
  async toBeHidden(received: Locator | ElementHandle, options?: TimeoutOptions) {
    const pass = await received.isHidden(options);
    return {
      pass,
      message: state => getAssertionMessage({
        ...state,
        assertionName: 'toBeHidden',
        ignoreExpected: true,
        // additionalMessage: '',
      })
    }
  },
  toMatchImageScreenshot(received: Uint8Array | Buffer, options: ToMatchImageSnapshotOptions | string) {
    const validOpts: ToMatchImageSnapshotOptions = typeof options === 'string' ? { name: options } : options;
    const buffer = received;
    const state = stateManager.getCurrentState();
    return matchImageSnapshot({
      buffer,
      options: validOpts,
      projectName: state.projectName,
      filepath: state.filepath,
    });
  },
  toMatchSnapshot(received: any, options: ToMatchJavaScriptSnapshotOptions | string) {
    const validOpts: ToMatchJavaScriptSnapshotOptions = typeof options === 'string' ? { name: options } : options;
    const state = stateManager.getCurrentState();
    const ret = matchJavaScriptSnapshot({
      value: received,
      options: validOpts,
      projectName: state.projectName,
      filepath: state.filepath,
    });
    debugMatcher('toMatchSnapshot', ret);
    return ret;
  },
  toThrowErrorMatchingSnapshot(received: Function | Error, options: ToMatchJavaScriptSnapshotOptions) {
    const validOpts: ToMatchJavaScriptSnapshotOptions = typeof options === 'string' ? { name: options } : options;
    const { projectName, filepath } = stateManager.getCurrentState();
    let message = '';
    return {
      pass: (state) => {
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
          message = getAssertionMessage({
            ...state,
            assertionName: 'toThrowErrorMatchingJavaScriptSnapshot',
            ignoreExpected: true,
            ignoreReceived: true,
          });
          return false;
        }
    
        const ret = matchJavaScriptSnapshot({
          value: state.rejects ? (received as unknown as Error)?.message : err.message,
          options: validOpts,
          projectName,
          filepath,
        });
        message = ret.message(state);

        return ret.pass;
      },
      message: () => message,
    }

  },
  async toMatchScreenshot(received: Locator | ElementHandle | Page, options: ToMatchImageSnapshotOptions | string) {
    if (typeof received?.screenshot !== 'function') {
      throw new Error('toMatchScreenshot: The received object is missing the "sreenshot" method');
    }

    const validOpts: ToMatchImageSnapshotOptions = typeof options === 'string' ? { name: options } : options;
    const buffer = await received.screenshot({
      type: 'png'
    });
    const state = stateManager.getCurrentState();
    return matchImageSnapshot({
      buffer,
      options: validOpts,
      projectName: state.projectName,
      filepath: state.filepath,
    });
  },
});
