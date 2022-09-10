import pc from 'picocolors';
import stripAnis from 'strip-ansi';
import {
  XBellTestCaseStatus,
  XBellTestFileRecord,
  XBellTestGroupRecord,
  XBellTestCaseRecord,
  XBellTestTaskRecord,
} from '../types';
import { isCase, isGroup } from '../utils/is';
import { XBellCaseStatus } from 'xbell-reporter';
import { recorder } from './recorder';
import { relative } from 'node:path';
import { createLogUpdate } from 'log-update';
const FOLD_ARROW = '❯';


const log = createLogUpdate(process.stdout);



// const fileRecords: XBellTestFileRecord[] = [
//   {
//     filename: 'a.test.tsx',
//     tasks: [
//       {
//         type: 'group',
//         filename: 'a.test.tsx',
//         groupDescription: 'group1 desc',
//         uuid: '1',
//         cases: [
//           {
//             type: 'case',
//             filename: 'a.test.tsx',
//             groupDescription: 'group1 desc',
//             caseDescription: 'case1 desc',
//             status: 'running',
//             uuid: '2',
//           },
//           {
//             type: 'case',
//             filename: 'b.test.tsx',
//             groupDescription: 'group1 desc',
//             caseDescription: 'case1 desc',
//             status: 'running',
//             uuid: '3',
//           }
//         ]
//       }
//     ]
//   },
//   {
//     filename: 'b.test.tsx',
//     tasks: [
//       {
//         type: 'case',
//         filename: 'a.test.tsx',
//         groupDescription: 'group1 desc',
//         caseDescription: 'case1 desc',
//         status: 'successed',
//         uuid: '3'
//       }
//     ]
//   }
// ];


function getUpLevelStatus({
  successed,
  failed,
  running,
  waiting
}: Record<XBellCaseStatus, boolean | number>): XBellCaseStatus {
  if (!running && !successed && !failed && waiting) {
    return 'waiting';
  }

  if (running) {
    return 'running';
  }
  if (failed) {
    return 'failed';
  }

  return 'successed'
}

const defaultCounter: Record<XBellCaseStatus, number> = {
  successed: 0,
  failed: 0,
  running: 0,
  waiting: 0,
}

const INDENT = 5;

const SPACES = ' '.repeat(INDENT);

class Printer {
  static StatusIcon: Record<XBellTestCaseStatus, string | string[]> = {
    successed: pc.green('✓'),
    failed: pc.red('×'),
    waiting: pc.yellow('●'),
    running: pc.yellow('●'),
    // running: ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚']
  }
  protected timer?: NodeJS.Timer;
  protected currentFrame = 0;
  protected files?: XBellTestFileRecord[]
  constructor() {}

  public getTaskInfo(
    tasks: XBellTestTaskRecord[],
    depth: number,
    caseCounter: Record<XBellTestCaseStatus, number>,
    caseErrors: string[],
  ): {
    text: string;
    status: XBellCaseStatus;
    caseCounter: Record<XBellTestCaseStatus, number>;
  } {
    const counterForUpLevel = { ...defaultCounter };
    const text = tasks.map(task => {
      if (isCase(task)) {
        counterForUpLevel[task.status]++;
        caseCounter[task.status]++;
        if (task.error) {
          caseErrors.push(this.getCaseError(task));
        }
        return `${SPACES}${'  '.repeat(depth)}  ${this.getStatusIcon(task.status)} ${task.caseDescription}`;
      } else {
        const { status: groupStatus, text: childText } = this.getTaskInfo(task.cases, depth + 1, caseCounter, caseErrors);
        counterForUpLevel[groupStatus]++;
        return `${SPACES}${'  '.repeat(depth)}  ${this.getColorTextByStatus(groupStatus, FOLD_ARROW)} ${task.groupDescription}\n${childText}`;
      }
    }).join('\n');

    return {
      status: getUpLevelStatus(counterForUpLevel),
      text,
      caseCounter,
    }
  }

  protected getFileLogs(file: XBellTestFileRecord) {
    const logText = file.logs.map(log => {
      if (log.type === 'stdout') {
        return pc.gray(log.content);
      }
      return pc.red(log.content);
    }).join('');

    return logText ? pc.bold(pc.magenta(pc.italic('Logs:'))) + `\n${logText}` : '';
  }

  protected getFileError(file: XBellTestFileRecord) {
    if (file.error) {
      return pc.bold(pc.red(pc.italic('Error:'))) + `\n${file.error.name || ''}: ${file.error.message || ''}\n${file.error.stack || ''}`
    }

    return '';
  }

  protected startWithNewLine(text: string) {
    return text ? '\n' + text : text;
  }

  protected getRainbowText(text: string): string {
    if (!text) return '';
    const start = [17, 184, 219];
    const end = [223, 118, 205];

    const length = text.length;
    let ret = ''
    text.split('').map((char, charIndex) => {
      const [
        r,
        g,
        b
      ] = start.map((s, idx) => Math.floor(s + (end[idx] - s) * charIndex / (length - 1)));
      ret += "\x1b[1m\x1b[38;2;" + `${r};${g};${b}m${char}` + "\x1b[0m\x1b[0;1m"
    })
    return ret;
  }
  

  public getAllFileInfo() {
    const fileStatusCounter = { ...defaultCounter };
    const caseStatusCounter = { ...defaultCounter };
    const caseErrors: string[] = [];
    const text = this.files!.map(file => {
      const { text, status } = file.error ? {
        text: '',
        status: 'failed',
      } as const : this.getTaskInfo(file.tasks, 0, caseStatusCounter, caseErrors);
      fileStatusCounter[status]++;
      return this.getStatusLabel(status) + ' ' + pc.white(this.getFilename(file.filename)) + (status === 'successed' ? '' : this.startWithNewLine(text)) + this.startWithNewLine(this.getFileLogs(file)) + this.startWithNewLine(this.getFileError(file));
    }).join('\n\n');

    return {
      text,
      fileStatusCounter,
      caseStatusCounter,
      caseErrors,
    }
  }

  getFilename(filepath: string) {
    const relativePath = filepath.split(process.cwd()).pop()!;
    const paths = relativePath.split('/');
    const filename = paths.pop();
    return pc.gray(paths.join('') + '/') + filename;
  }

  protected getStatusIcon(status: XBellTestCaseStatus) {
    const { StatusIcon } = Printer;
    const icons = StatusIcon[status]
    return Array.isArray(icons) ? icons[this.currentFrame % icons.length] : icons;
  }

  protected getStatusLabel(status: XBellCaseStatus) {
    if (status === 'waiting') {
      return pc.bold(pc.inverse(pc.yellow(' WAIT ')));
    }

    if (status === 'running') {
      return pc.bold(pc.inverse(pc.yellow(' RUNS ')));
    }

    if (status === 'successed') {
      return pc.bold(pc.inverse(pc.green(' PASS ')));
    }

    if (status === 'failed') {
      return pc.bold(pc.inverse(pc.red(' FAIL ')));
    }
  }

  print(testFileRecords: XBellTestFileRecord[]) {
    this.files = testFileRecords;
    this.currentFrame++;
    const { text, fileStatusCounter, caseStatusCounter, caseErrors } = this.getAllFileInfo();
    const summaryText = this.getSummary({ fileStatusCounter, caseStatusCounter });
    const errorText = caseErrors.map((text, idx, arr) => {
      const total = arr.length;
      const title = pc.bold(pc.red(this.getCenterText(
        (` Failed Cases [${idx + 1}/${total}] `), { symbol: '-'})
        ));
      return `${title}\n${text}`
    }).join('\n') + (
      caseErrors.length ? `\n${pc.bold(pc.red(this.getCenterText('End', { symbol: '-'})))}` : ''
    );
    // const startLine = this.getCenterText(), { symbol: pc.cyan('-') });
    // const endLine = this.getCenterText(pc.bold(pc.inverse(pc.cyan(' END '))), { symbol: pc.cyan('-') });
    // log(startLine + '\n' + text + '\n\n' + summaryText + '\n\n' + errorText + '\n' + endLine);
    log(
      [
        pc.bold(
          pc.cyan('[XBELL TESTING]')
        ) + ' 🎐',
        // this.getRainbowText('[XBELL TESTING]') + ' 🎐',
        text,
        errorText,
        summaryText,
      ].filter(Boolean).join('\n\n'));
  }

  startPrint() {
    this.timer = setInterval(() => {
      if (this.files) {
        this.print(this.files);
      }
    }, 100)
  }

  stopPrint() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  clear() {

  }

  public getCenterText(text: string, {
    symbol
  }: Partial<{
    symbol: string;
  }> = {}) {
    const textLength = stripAnis(text).length;
    const cols = process.stdout?.columns || Math.pow(2, 5);
    const sideOffset = Math.floor(Math.max((cols - textLength), 0) / 2);
    symbol = symbol || ' '
    const sideText = symbol.repeat(sideOffset);
    return sideText + text + sideText;
  }

  getColorTextByStatus(status: XBellCaseStatus, text: string) {
    if (status === 'failed') {
      return pc.red(text);
    }

    if (status === 'successed') {
      return pc.green(text);
    }

    if (status === 'running') {
      return pc.yellow(text);
    }

    if (status === 'waiting') {
      return pc.yellow(text);
    }
  }

  getSummary({
    fileStatusCounter,
    caseStatusCounter
  }: {
    fileStatusCounter: Record<XBellCaseStatus, number>;
    caseStatusCounter: Record<XBellCaseStatus, number>
  }) {
    const isAllPassed = fileStatusCounter.failed === 0 && fileStatusCounter.running === 0 && fileStatusCounter.waiting === 0;

    return [
      'Test ' + 'Files: ' + this.getTotals(fileStatusCounter),
      'Test ' + 'Cases: ' + this.getTotals(caseStatusCounter),
      '      Time: ' + this.formatTime((Date.now() - recorder.getStartTime())),
      isAllPassed ? '\n' + this.getRainbowText('ALL PASSED!') : ''
    ].filter(Boolean).join('\n')
  }

  formatTime(ms: number) {
    if (ms >= 1000) {
      return (ms / 1000).toFixed(3).replace(/(\.)?0+$/, '') + 's';
    }

    return ms + 'ms';
  }

  getTotals(counter: Record<XBellCaseStatus, number>): string {
    const total = Object.entries(counter).reduce((acc, [key, num]) => acc + num, 0);
    return [
      counter.failed ? pc.bold(pc.red(counter.failed + ' failed')) : undefined,
      counter.waiting ? pc.bold(pc.yellow(counter.waiting + ' waiting')) : undefined,
      counter.running ? pc.bold(pc.yellow(counter.running + ' running')) : undefined,
      pc.bold(pc.green(counter.successed + ' passed')),
      total + ' total',
    ].filter(Boolean).join(', ')
  }

  getCaseError(c: XBellTestCaseRecord): string {
    if (!c.error) return ''

    return [
      this.getCasePath(c),
      c.error.message
    ].join('\n\n');
  }

  getCasePath(c: XBellTestCaseRecord): string {
    return [
      this.getFilename(c.filename),
      (c.groupDescription || ''),
      c.caseDescription,
    ].filter(Boolean).join(pc.gray(' > '))
  }
}

export const printer = new Printer();

