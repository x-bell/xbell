import * as chalk from 'chalk';
import * as fs from 'fs';
import { codeFrameColumns } from '@babel/code-frame';
import StackUtils =  require('stack-utils');
import * as path from 'path';
import { dim } from 'colors/safe';


const FAIL_TEXT = '失败';
const PASS_TEXT = '成功';
const RUNNING_TEXT = '运行中';

const stackUtils = new StackUtils({
  cwd: 'empty',
})

function getColorTitle(title: string, color: 'green' | 'red' | 'yellow' | 'cyan' | 'white') {
  return chalk.supportsColor ? chalk.reset.inverse.bold[color]?.(` ${title} `) + ' ' : `${title} `
}

const PASS = getColorTitle(PASS_TEXT, 'green')
const FAIL = getColorTitle(FAIL_TEXT, 'red')
const RUNING = getColorTitle(RUNNING_TEXT, 'yellow')
// const INFO = chalk.supportsColor ? chalk.reset.inverse.bold.yellow(` ${RUNNING_TEXT} `) : RUNNING_TEXT
class PrettyPrint {
  loadingTimer: NodeJS.Timeout | null = null;
  public logStd(str: string) {
    process.stdout.write(str + '\n')
  }

  public logErr(str: string) {
    process.stderr.write(str)
  }

  public log(str: string) {
    return chalk.supportsColor ? this.logStd(str) : this.logErr(str)
  }

  public running(...content: string[]) {
    this.log(RUNING + content.join(''))
  }
  
  public pass(...content: string[]) {

  }

  public groupRuning(groupName: string) {
      // readline.cursorTo(process.stdout, 0);
    this.log(RUNING + groupName)
  }

  public caseRuning(caseName: string) {
    this.startLoading(caseName)
  }

  public caseFinished(caseName: string) {
    this.stopLoading()
    console.log(
      chalk.green.bold('✅') + ' ' + caseName
    );
  }

  public caseFailed(caseName: string) {
    this.stopLoading()
    console.log(
      chalk.red.bold('❌') + ' ' + caseName
    );
  }

  public info(title: string, ...content: string[]) {
    const colorTitle = getColorTitle(title, 'white') + content.join('')
    console.log(colorTitle)
  }

  public startLoading(content: string = '') {
    const frames =   ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚']

    let x = 0;
    this.loadingTimer = setInterval(() => {
      x++;
      process.stdout.write('\r' + frames[x % frames.length] + ' ' + content);
    }, 1000 / 30);
  }

  public stopLoading() {
    if (this.loadingTimer != null) {
      clearInterval(this.loadingTimer)
    }
    process.stdout.write('\r')
  }

  public printErrorStack(error: Error) {
    if (!error.stack) {
      return;
    }

    const { location, codeLines, message } = parseStack(error.stack) || {}
    if (location) {
      const codeFrame = codeFrameColumns(
        fs.readFileSync(location.filename, 'utf8'),
        {
          start: location
        },
        {
          highlightCode: true,
        }
      )
      console.log(message)
      console.log('');
      console.log(codeFrame);
      if (codeLines?.length) {
        console.log(
          dim(codeLines[0])
        )
      }
    }
  }
}


function parseStack(stack: string) {
  const lines = stack.split('\n')
    let firstCodeLine = lines.findIndex(line => line.startsWith('    at '));
    if (firstCodeLine === -1) {
      firstCodeLine = lines.length - 1;
    }
    const message = lines.slice(0, firstCodeLine).join('\n');
    const codeLines = lines.slice(firstCodeLine);
    for (const line of codeLines) {
      const parsed = stackUtils.parseLine(line);
      if (!parsed || !parsed.file || parsed.file.includes('node_module') || parsed.file.includes('node:')) continue;
      // const resolvedFile = path.join(process.cwd(), parsed.file);
      // console.log(' parsed.file',  parsed.file);
      const location = {
        filename: parsed.file,
        column: parsed.column || 0,
        line: parsed.line || 0,

      }
      return {
        location,
        codeLines,
        message,
      }
    }
}
export const prettyPrint = new PrettyPrint()
