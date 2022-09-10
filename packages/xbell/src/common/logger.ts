import pc from 'picocolors';

export interface XBellLogger {
  debugTime(trigger: string): void;
  debugTimeEnd(trigger: string): void;

}

export class Logger implements XBellLogger {
  timeMap = new Map<string, number>();

  debugLog(trigger: string, message: any) {
    console.log(
      `${pc.yellow(trigger + ':')}`, message
    )
  }

  debugTime(trigger: string) {
    this.timeMap.set(trigger, Date.now())
  }

  debugTimeEnd(trigger: string) {
    const date = this.timeMap.get(trigger)
    if (!date) {
      console.log(
        `${pc.yellow(trigger + ':')} ${pc.red('ensure invoke debugTime(...) before debugTimeEnd(...)')}`
      )
      return;
    }

    console.log(
      `${pc.yellow(trigger + ':')} ${pc.white(Date.now() - date)}ms`
    );
    this.timeMap.delete(trigger);
  }
}

export const logger = new Logger();
