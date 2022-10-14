import type { XBellLocator, XBellElementHandle, XBellPage } from '../../types';
import { defineMatcher } from 'expell';
import { _matchImageSnapshot } from './match-image-snapshot';
import { stateManager } from '../state-manager';

export const elementMatcher = defineMatcher({
  async toBeChecked(received: XBellLocator | XBellElementHandle) {
    const pass = await received.isChecked();
    return {
      pass,
      message: ({ not }) => ``,
    };
  },
  async toBeDisabled(received: XBellLocator | XBellElementHandle) {
    const pass = await received.isDisabled();
    return {
      pass,
      message: () => ``,
    }
  },
  async toBeVisible(received: XBellLocator | XBellElementHandle) {
    const pass = await received.isVisible();
    return {
      pass,
      message: () => ``,
    }
  },
  async toBeHidden(received: XBellLocator | XBellElementHandle) {
    const pass = await received.isHidden();
    return {
      pass,
      message: ({ not }) => ``,
    }
  },
  async toMatchScreenshot(received: XBellLocator | XBellElementHandle | XBellPage, options: { name: string } ) {
    if (typeof received?.screenshot !== 'function') {
      throw new Error('toMatchScreenshot: The received object is missing the "sreenshot" method');
    }
  
    const buffer = await received.screenshot({
      type: 'png'
    });
    const state = stateManager.getCurrentState();
    return _matchImageSnapshot({
      buffer,
      options,
      projectName: state.projectName,
      filepath: state.filepath,
    });
  },
})