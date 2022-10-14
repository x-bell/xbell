// import { Page, Locator } from 'playwright-core';


// interface XBellQuery {
//   queryByText(text: string): XBellLocator;
//   queryByClass(className: string, tagType?: string): XBellLocator;
//   queryByTestId(testId: string, tagType?: string): XBellLocator;
//   queryByPlaceholder(placeholder: string, tagType?: string): XBellLocator;
//   queryById(id: string): XBellLocator;
//   // from playwright-core
//   locator(selector: string, options?: {
//     /**
//      * Matches elements containing an element that matches an inner locator. Inner locator is queried against the outer one.
//      * For example, `article` that has `text=Playwright` matches `<article><div>Playwright</div></article>`.
//      *
//      * Note that outer and inner locators must belong to the same frame. Inner locator must not contain [FrameLocator]s.
//      */
//     has?: Locator;

//     /**
//      * Matches elements containing specified text somewhere inside, possibly in a child or a descendant element. When passed a
//      * [string], matching is case-insensitive and searches for a substring. For example, `"Playwright"` matches
//      * `<article><div>Playwright</div></article>`.
//      */
//     hasText?: string|RegExp;
//   }): XBellLocator;
// }

// export interface XBellPage extends Omit<Page, 'locator'>, XBellQuery  {
  
// }

// export interface XBellLocator extends Omit<Locator, 'locator'>, XBellQuery {
//   nth(index: number): XBellLocator;
//   first(): XBellLocator;
//   last(): XBellLocator;
// }