import { XBellEnvRecord } from 'xbell-reporter';
import { parseError } from './utils/error';

type Env = XBellEnv['name'];

export class Recorder {

  constructor(public records: XBellEnvRecord) {}

  public startCase(env: Env, groupIndex: number, caseIndex: number) {
    this.records[env][groupIndex].cases[caseIndex].status = 'running';
  }

  public finishCase(env: Env, groupIndex: number, caseIndex: number) {
    this.records[env][groupIndex].cases[caseIndex].status = 'successed';
  }

  public wrongCase(env: Env, groupIndex: number, caseIndex: number, error: Error) {
    const errorRet = parseError(error)
    const targetCase = this.records[env][groupIndex].cases[caseIndex];
    targetCase.status = 'failed';
    targetCase.errors = targetCase.errors || [];
    if (errorRet) {
      targetCase.errors.push(errorRet);
    }
  }

  public addCaseVideoRecord(env: Env, groupIndex: number, caseIndex: number, filepath: string) {
    this.records[env][groupIndex].cases[caseIndex].videoRecords.push({
      filepath,
    })
  }
}
