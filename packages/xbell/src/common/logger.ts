import color from '@xbell/color';

export interface XBellLogger {
  debugTime(trigger: string): void;
  debugTimeEnd(trigger: string): void;

}

export class Logger implements XBellLogger {
  timeMap = new Map<string, number>();

  debugLog(trigger: string, message: any) {
    console.log(
      `${color.yellow(trigger + ':')}`, message
    )
  }

  debugTime(trigger: string) {
    this.timeMap.set(trigger, Date.now())
  }

  debugTimeEnd(trigger: string) {
    const date = this.timeMap.get(trigger)
    if (!date) {
      console.log(
        `${color.yellow(trigger + ':')} ${color.red('ensure invoke debugTime(...) before debugTimeEnd(...)')}`
      )
      return;
    }

    console.log(
      `${color.yellow(trigger + ':')} ${color.white(Date.now() - date)}ms`
    );
    this.timeMap.delete(trigger);
  }
}

export const logger = new Logger();
