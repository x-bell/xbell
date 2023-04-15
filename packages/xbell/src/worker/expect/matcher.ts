import type { ToMatchImageSnapshotOptions, ToMatchJavaScriptSnapshotOptions } from '@xbell/snapshot';
import type { ExpectMatchState } from '@xbell/assert';
import type { Locator, ElementHandle, CommonPage, E2EMatcher } from '../../types';
import type { TimeoutOptions } from '../../types/pw';
import { matchImageSnapshot, matchJavaScriptSnapshot } from '@xbell/snapshot';
import { defineMatcher, getAssertionMessage } from '@xbell/assert';
import { stateManager } from '../state-manager';
import debug from 'debug';

const debugMatcher = debug('xbell:matcher');

export const e2eMatcher: E2EMatcher = defineMatcher({
  toBeChecked(received: Locator | ElementHandle, options?: TimeoutOptions) {
    return async (state: ExpectMatchState) => {
      const pass = await received.isChecked(options);
      return {
        pass,
        message: () => getAssertionMessage({
          ...state,
          assertionName: 'toBeChecked',
          expectedLabel: 'Expected selector',
          receivedLabel: 'Received selector',
          expectedFormat: `${state.not ? 'not ' : ''}checked`,
          receivedFormat: `${state.not ? '' : 'not '}checked`
        }),
      };
    };
  },
  toBeDisabled(received: Locator | ElementHandle, options?: TimeoutOptions) {
    return async (state) => {
      const pass = await received.isDisabled(options);
      return {
        pass,
        message: () => getAssertionMessage({
          ...state,
          assertionName: 'toBeDisabled',
          expectedLabel: 'Expected selector',
          receivedLabel: 'Received selector',
          expectedFormat: `${state.not ? 'not ' : ''}disabled`,
          receivedFormat: `${state.not ? '' : 'not '}disabled`
        }),
      };
    }
  },
   toBeVisible(received: Locator | ElementHandle, options?: TimeoutOptions) {
    return async (state) => {
      const pass = await received.isVisible(options);
      return {
        pass,
        message: () => getAssertionMessage({
          ...state,
          assertionName: 'toBeVisible',
          expectedLabel: 'Expected selector',
          receivedLabel: 'Received selector',
          expectedFormat: `${state.not ? 'not ' : ''}visible`,
          receivedFormat: `${state.not ? '' : 'not '}visible`
        })
      };
    }
  },
  toBeHidden(received: Locator | ElementHandle, options?: TimeoutOptions) {
    return async (state) => {
      const pass = await received.isHidden(options);
      return {
        pass,
        message: () => getAssertionMessage({
          ...state,
          assertionName: 'toBeHidden',
          expectedLabel: 'Expected selector',
          receivedLabel: 'Received selector',
          expectedFormat: `${state.not ? 'not ' : ''}hidden`,
          receivedFormat: `${state.not ? '' : 'not '}hidden`
        })
      };
    }
  },
  toMatchImageSnapshot(received: Uint8Array | Buffer, options: ToMatchImageSnapshotOptions | string) {
    return async (state) => {
      if (Object.prototype.toString.apply(received) === '[object Object]') {
        received = new Uint8Array(Object.values(received));
      }
      const validOpts: ToMatchImageSnapshotOptions = typeof options === 'string' ? { name: options } : options;
      const buffer = received;
      const testState = stateManager.getCurrentState();
      return matchImageSnapshot({
        ...state,
        buffer,
        options: validOpts,
        projectName: testState.projectName,
        filepath: testState.filepath,
      });
    }
  },
  toMatchSnapshot(received: any, options: ToMatchJavaScriptSnapshotOptions | string) {
    return async (state) => {
      const validOpts: ToMatchJavaScriptSnapshotOptions = typeof options === 'string' ? { name: options } : options;
      const testState = stateManager.getCurrentState();
      const ret = matchJavaScriptSnapshot({
        ...state,
        value: received,
        options: validOpts,
        projectName: testState.projectName,
        filepath: testState.filepath,
      });
      debugMatcher('toMatchSnapshot', ret);
      return ret;
    };
  },
  toThrowErrorMatchingSnapshot(received: Function | Error, options: ToMatchJavaScriptSnapshotOptions) {
    return async (state) => {
      const validOpts: ToMatchJavaScriptSnapshotOptions = typeof options === 'string' ? { name: options } : options;
      const { projectName, filepath } = stateManager.getCurrentState();

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
          message: () => getAssertionMessage({
            ...state,
            assertionName: 'toThrowErrorMatchingSnapshot',
            ignoreExpected: true,
            ignoreReceived: true,
          }),
        };
      }

      return matchJavaScriptSnapshot({
        ...state,
        value: state.rejects ? (received as unknown as Error)?.message : err.message,
        options: validOpts,
        projectName,
        filepath,
      });
    };
  },
  toMatchScreenshot(received: Locator | ElementHandle | CommonPage, options: ToMatchImageSnapshotOptions | string) {
    return async (state) => {
      if ('screenshot' in received && typeof received?.screenshot !== 'function') {
        throw new Error('toMatchScreenshot: The received object is missing the "sreenshot" method');
      }
  
      const validOpts: ToMatchImageSnapshotOptions = typeof options === 'string' ? { name: options } : options;
      const buffer = await received.screenshot({
        type: 'png'
      });
      const testState = stateManager.getCurrentState();
      return matchImageSnapshot({
        ...state,
        buffer,
        options: validOpts,
        projectName: testState.projectName,
        filepath: testState.filepath,
      });
    };
  },
});
