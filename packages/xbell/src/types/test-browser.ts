import type { TestArgumentsBasic } from './test';

export interface BrowserTestArguments extends TestArgumentsBasic {
  runtime: 'browser';
  importActual: <T = any>(path: string) => Promise<T>;
}

export interface XBellBrowserTestCaseFunction<BrowserExtensionArg = {}> {
  (args: BrowserExtensionArg): (void | Promise<void>);
}

export interface XBellBrowserTest<BrowserExtArgs = {}> {
  (caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtArgs>): void;

  only(caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtArgs>): void;

  skip(caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtArgs>): void;

  todo(caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtArgs>): void;

  each<T>(items: T[]): (caseDescription: string | ((item: T, index: number) => string), testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtArgs & { item: T; index: number }>) => void;

  batch<T>(items: T[]): (caseDescription: string, testCaseFunction: XBellBrowserTestCaseFunction<BrowserExtArgs & { item: T; index: number }>) => void;

  extend<T extends (args: BrowserExtArgs) => any>(browserCallback: T): XBellBrowserTest<Awaited<ReturnType<T>>>;

  mock(path: string, factory: (args: BrowserExtArgs) => any): void;
}

