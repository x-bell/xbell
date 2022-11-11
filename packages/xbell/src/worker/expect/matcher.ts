import type { ToMatchImageSnapshotOptions, ToMatchJavaScriptSnapshotOptions } from '@xbell/snapshot';
import type { Locator, ElementHandle, Page } from '../../types';
import type { TimeoutOptions } from '../../types/pw';
import { matchImageSnapshot, matchJavaScriptSnapshot } from '@xbell/snapshot';
import { defineMatcher, getAssertionMessage } from '@xbell/assert';
import { stateManager } from '../state-manager';

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
  async toMatchImageScreenshot(received: Uint8Array | Buffer, options: ToMatchImageSnapshotOptions | string) {
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
  async toMatchJavaScriptSnapshot(received: any, options: ToMatchJavaScriptSnapshotOptions | string) {
    const validOpts: ToMatchJavaScriptSnapshotOptions = typeof options === 'string' ? { name: options } : options;
    const state = stateManager.getCurrentState();
    return matchJavaScriptSnapshot({
      value: received,
      options: validOpts,
      projectName: state.projectName,
      filepath: state.filepath,
    })
  },
  toThrowErrorMatchingJavaScriptSnapshot(received: Function, options: ToMatchJavaScriptSnapshotOptions) {
    const validOpts: ToMatchJavaScriptSnapshotOptions = typeof options === 'string' ? { name: options } : options;

    let err: any;
    let isThrow = false;
    try {
      received()
    } catch (e) {
      isThrow = true;
      err = e;
    }

    if (!isThrow) {
      return {
        pass: false,
        message: state => getAssertionMessage({
          ...state,
          assertionName: 'toThrowErrorMatchingJavaScriptSnapshot',
          ignoreExpected: true,
          ignoreReceived: true,
        }),
      };
    }

    const state = stateManager.getCurrentState();

    return matchJavaScriptSnapshot({
      value: err?.message,
      options: validOpts,
      projectName: state.projectName,
      filepath: state.filepath,
    });

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
