import { Recorder } from './recorder';
import { XBellCaseStatus } from 'xbell-reporter';
import { getStringDisplayLength, isChinese } from './utils/char';
import chalk from 'chalk';

export interface TableRow {
  Group: string;
  Case: string;
  Status: string;
}

export class Printer {
  activeEnv!: XBellEnv['name'];
  timer?: NodeJS.Timer;
  frames = ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚'];

  columns = [
    {
      title: 'Group',
      length: 10,
      key: 'Group',
    },
    {
      title: 'Case',
      length: 20,
      key: 'Case',
    },
    {
      title: 'Status',
      length: 8,
      key: 'Status',
    },
    // {
    //   title: 'Error',
    //   length: 30,
    //   key: 'Error',
    // }
  ] as const

  currentFrame = 0;

  constructor(protected recorder: Recorder) {

  }

  public setActiveEnv(env: XBellEnv['name']) {
    this.activeEnv = env;
  }

  public getStatusText(status: XBellCaseStatus) {
    if (status === 'failed') {
      return '❌';
    }
    if (status === 'successed') {
      return '✅';
    }

    if (status === 'waiting') {
      return '⏳';
    }
    return this.frames[this.currentFrame % this.frames.length];
  }

  public getRecordTable(): TableRow[] {
    // const maxLength = 10;
    return this.recorder.records[this.activeEnv].reduce<TableRow[]>((tableAcc, groupRecord) => {
      const rows = groupRecord.cases.reduce<TableRow[]>((rowAcc, caseRecrod) => {
        rowAcc.push({
          Group: groupRecord.groupName,
          Case: caseRecrod.caseName,
          Status: this.getStatusText(caseRecrod.status),
          // Error: caseRecrod.errors?.[0]?.message || '',
        });
        return rowAcc;
      }, []);
      return [
        ...tableAcc,
        ...rows,
      ];
     }, []);
  }

  public getEnvText() {
    return chalk.reset.cyan.bgWhite.inverse(` ${this.activeEnv} 环境 `);
  }

  print() {
    if (!this.activeEnv) {
      return;
    }
    // console.clear();
    // this.drawTableHeader();
    // this.drawTableContent();
    // this.drawTableBottomBorder();
    const table = this.getRecordTable();
    console.clear();
    console.log(this.getEnvText());
    console.table(table);
  }

  printAllErrors() {
    // Object.entries(this.recorder.records).reduce(([env, groups]) => {
    //   groups
    // })
  }

  start() {
    this.timer = setInterval(() => {
      this.currentFrame++;
      this.print();
    }, 1000 / 20);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  getColumnContent(colLength: number, content: string) {
    const len = getStringDisplayLength(content);
    

    let diffLength = colLength - len;

    if (diffLength === 0) {
      return content;
    }

    if (diffLength < 0) {
      content = content.slice(0, colLength - 3) + '...';
    }

    diffLength = colLength - getStringDisplayLength(content);

    const halfDiffLength = Math.floor(diffLength / 2)
    const blank =  ' '.repeat(halfDiffLength);
    const ret = blank + content + blank
    return (len + blank.length * 2) < colLength ? ret + ' ' : ret;
  }

  drawTableHeader() {
    let firstLine = '┌'
    let contentLine = '│';
    for (let i = 0, l = this.columns.length; i < l; i++) {
      const col = this.columns[i];
      firstLine += '─'.repeat(col.length)
      contentLine += this.getColumnContent(col.length, col.title);
      contentLine += '│'
      if (i === l - 1) {
        firstLine += '┐';
      } else {
        firstLine += '┬';
      }
    }

    console.log(firstLine);
    console.log(contentLine);
  }

  drawTableBottomBorder() {
    let line = '└'
    for (let i = 0, l = this.columns.length; i < l; i++) {
      const col = this.columns[i];
      line += '─'.repeat(col.length);
      if (i === l - 1) {
        line += '┘';
      } else {
        line += '┴';
      }
    }
    console.log(line);
  }

  drawTableContent() {
    const table = this.getRecordTable();
    const groupRecords = this.recorder.records[this.activeEnv];
    for (let rowIndex = 0, rowCount = table.length; rowIndex < rowCount; rowIndex++) {
      const row = table[rowIndex];
      let rowBorderLine = '├';
      let rowContentLine = '│'
      for (let colIndex = 0, colCount = this.columns.length; colIndex < colCount; colIndex++) {
        const col = this.columns[colIndex];
        rowBorderLine += '─'.repeat(col.length)
        rowContentLine += this.getColumnContent(col.length,  row[col.key]);
        rowContentLine += '│'
        if (colIndex === colCount - 1) {
          rowBorderLine += '┤';
        } else {
          rowBorderLine += '┼';
        }
      }
      console.log(rowBorderLine);
      console.log(rowContentLine);
    }
  }
}
