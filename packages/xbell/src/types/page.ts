import { Page, Locator } from 'playwright-core';

export interface XBellPage extends Page  {
  queryByText(text: string): Locator;
}