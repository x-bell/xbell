interface XBellAllTestCaseFunction<CommonExtensionArguments> {
  (args: CommonExtensionArguments): (void | Promise<void>);
}

export interface XBellAllTest<CommonExtensionArguments = {}> {
  (caseDescription: string, testCaseFunction: XBellAllTestCaseFunction<CommonExtensionArguments>): void;
  only(caseDescription: string, testCaseFunction: XBellAllTestCaseFunction<CommonExtensionArguments>): void;

  skip(caseDescription: string, testCaseFunction: XBellAllTestCaseFunction<CommonExtensionArguments>): void;

  todo(caseDescription: string, testCaseFunction: XBellAllTestCaseFunction<CommonExtensionArguments>): void;

  each<T>(items: T[]): (caseDescription: string | ((item: T, index: number) => string), testCaseFunction: XBellAllTestCaseFunction<CommonExtensionArguments & { item: T; index: number }>) => void;

  batch<T>(items: T[]): (caseDescription: string, testCaseFunction: XBellAllTestCaseFunction<CommonExtensionArguments & { item: T; index: number }>) => void;

  extend<T extends (args: CommonExtensionArguments) => any>(browserCallback: T): XBellAllTest<Awaited<ReturnType<T>>>;

  mock(path: string, factory: (args: CommonExtensionArguments) => any): void;
}
