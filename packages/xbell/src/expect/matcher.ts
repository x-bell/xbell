import { defineMatcher } from 'expell';
import { XBellLocator, XBellElementHandle, XBellPage } from '../types';
import { _matchImageSnapshot } from './match-image-snapshot';

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
    return _matchImageSnapshot(buffer, options);
  },
})