import { Locator } from './locator';

export interface FrameLocator {
  getByText(text: string): Locator;
  getByTestId(testId: string): Locator;
  getByClass(className: string): Locator;
  get(selector: string): Locator;
}
