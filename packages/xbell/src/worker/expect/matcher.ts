import type { ToMatchImageSnapshotOptions, ToMatchJavaScriptSnapshotOptions } from '@xbell/snapshot';
import type { Locator, ElementHandle, Page } from '../../types';
import { matchImageSnapshot, matchJavaScriptSnapshot } from '@xbell/snapshot';
import { defineMatcher } from 'expell';
import { stateManager } from '../state-manager';

export const elementMatcher = defineMatcher({
  async toBeChecked(received: Locator | ElementHandle) {
    const pass = await received.isChecked();
    return {
      pass,
      message: ({ not }) => ``,
    };
  },
  async toBeDisabled(received: Locator | ElementHandle) {
    const pass = await received.isDisabled();
    return {
      pass,
      message: () => ``,
    }
  },
  async toBeVisible(received: Locator | ElementHandle) {
    const pass = await received.isVisible();
    return {
      pass,
      message: () => ``,
    }
  },
  async toBeHidden(received: Locator | ElementHandle) {
    const pass = await received.isHidden();
    return {
      pass,
      message: ({ not }) => ``,
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
})