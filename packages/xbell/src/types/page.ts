import { Page, Locator } from 'playwright-core';

export interface XBellPage extends Page  {
  queryByText(text: string): Locator;
  queryByClass(className: string, tagType?: string): Locator;
  queryByTestId(testId: string, tagType?: string): Locator;
  queryByPlaceholder(placeholder: string, tagType?: string): Locator;
  queryById(id: string): Locator;
}