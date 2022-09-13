import { defineMatcher } from 'expell';
import { XBellLocator, XBellElementHandle, XBellPage } from '../types';

const elementMatcher = defineMatcher({
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
      message: () => ``,
    }
  },
  async toMatchScreenshot(received: XBellLocator | XBellElementHandle | XBellPage) {
    const buffer = received.screenshot();
  },
})