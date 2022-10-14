import type { XBellTestCaseFunctionArguments } from './test';
import type { Awaitable } from './utils';

export type FixtureFunction<T> = (args: XBellTestCaseFunctionArguments<any>) => Awaitable<T>;



// export const myFixture = defineFixture(({ page }) => ({
//   buttonFixture: {
//     async onClick(text: string) {
//       await page.locateByText(text).click()
//     }
//   }
// }));
