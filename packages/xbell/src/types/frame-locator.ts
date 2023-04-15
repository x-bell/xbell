import { Locator } from './locator';

export interface FrameLocator {
  getByText(text: string): Locator;
  getByTestId(testId: string): Locator;
  getByClass(className: string): Locator;
  get(selector: string): Locator;
  locator(selector: string): Locator;
  getById(id: string): Locator;
  first(): FrameLocator;
  last(): FrameLocator;
  nth(index: number): FrameLocator;
  getFrame(selector: string): FrameLocator;
}
