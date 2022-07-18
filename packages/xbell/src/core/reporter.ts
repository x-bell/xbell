import chalk, { supportsColor } from 'chalk';

export enum Status {
  Running = 'running',
  NotStart = 'notStart',
  Pass = 'pass',
  Failed = 'failed'
}

export interface StepRecord {
  name: string;
  status: Status;
}

export interface CaseRecord {
  name: string;
  steps: StepRecord[]
  status: Status;
}
export interface GroupRecord {
  name: string
  cases: CaseRecord[]
  status: Status
}

export interface TableRow {
  Group: string;
  Case: string;
  Status: string;
}

export class Reporter {
  frames = ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚'];
  currentFrame: number = 0;
  timer: NodeJS.Timer | null = null;
  constructor(public groupRecords: GroupRecord[], public env: string, public debug?: boolean) {}

  public finishGroup(index: number) {

  }

  public startCase(groupIndex: number, caseIndex: number) {
    this.groupRecords[groupIndex].cases[caseIndex].status = Status.Running;
    this.print();
  }

  public finishCase(groupIndex: number, caseIndex: number) {
    this.groupRecords[groupIndex].cases[caseIndex].status = Status.Pass;
    this.print();
  }

  public wrongCase(groupIndex: number, caseIndex: number) {
    this.groupRecords[groupIndex].cases[caseIndex].status = Status.Failed;
    this.print();
  }

  public getGroupText(text: string, status: Status): string {
    const finalText = ` 测试组: ${text} `;
    if (status === Status.NotStart) {
      return chalk.reset.yellow.inverse.bold(finalText);
    }

    if (status === Status.Running) {
      return chalk.reset.yellow.inverse.bold(finalText);
    }

    if (status === Status.Failed) {
      return chalk.reset.red.inverse.bold(finalText);
    }

    return chalk.reset.green.inverse.bold(finalText);
  }

  public getCaseText(text: string, status: Status): string {
    const icon = this.getCaseIcon(status);
    return icon + ' ' + this.getCaseColorText(text, status);
  }

  public getCaseIcon(status: Status) {
    if (status === Status.NotStart) {
      return '⏳';
    }

    if (status === Status.Running) {
      return '🕛';
    }

    if (status === Status.Failed) {
      return chalk.reset.red('✖️');
    }

    return chalk.reset.green('✔️');
  }

  public getCaseColorText(text: string, status: Status): string {
    if (status === Status.NotStart || status === Status.Running) {
      return chalk.reset.yellow(text);
    }

    if (status === Status.Failed) {
      return chalk.reset.red(text);
    }

    return chalk.reset.green(text);
  }

  public getEnvText() {
    return chalk.reset.cyan.bgWhite.inverse(` ${this.env} 环境 `);
  }

  public getStatusText(status: Status) {
    if (status === Status.Failed) {
      return '❌';
    }
    if (status === Status.Pass) {
      return '✅';
    }

    if (status === Status.NotStart) {
      return '⏳';
    }
    return this.frames[this.currentFrame % this.frames.length];
  }

  public getRecordTable(): TableRow[] {
    const maxLength = 10;
    return this.groupRecords.reduce<TableRow[]>((tableAcc, groupRecord) => {
      const rows = groupRecord.cases.reduce<TableRow[]>((rowAcc, caseRecrod) => {
        rowAcc.push({
          Group: groupRecord.name.slice(0, maxLength),
          Case: caseRecrod.name.slice(0, maxLength),
          Status: this.getStatusText(caseRecrod.status),
        });
        return rowAcc;
      }, []);
      return [
        ...tableAcc,
        ...rows,
      ];
     }, []);
  }

  public getReportText(): string {
    
    const groupText = this.groupRecords.map(group => {
      return [
        this.getGroupText(group.name, group.status),
        group.cases.map(c => {
          return this.getCaseText(c.name, c.status);
        }).join('\n')
      ].join('\n');
    }).join('\n');
    return [
      this.getEnvText(),
      groupText
    ].join('\n');
  }

  public print() {
    if (!supportsColor || this.debug) {
      return;
    }
    // TODO:
    const table = this.getRecordTable();
    console.clear();
    console.log(this.getEnvText());
    console.table(table);
  }

  public startPrint() {
    this.timer = setInterval(() => {
      this.currentFrame++;
      this.print();
    }, 1000 / 20);
  }

  public stopPrint() {
    if (this.timer != null) {
      clearInterval(this.timer);
    };
  }
}