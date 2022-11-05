import color from '@xbell/color';

interface XBellErrorTips {
  NotFoundTestFiles: string;
}

const ErrorTipsEN: XBellErrorTips = {
  NotFoundTestFiles: 'Not found test files',
};

class Prompter {
  constructor(protected tips: XBellErrorTips) {}

  displayError(tip: keyof XBellErrorTips, options?: Partial<{ exit: boolean }>) {
    const message = this.tips[tip]
    console.log(
      color.red(message)
    );
    if (options?.exit) {
      process.exit(0);
    }
  }
}


export const prompter = new Prompter(ErrorTipsEN);
