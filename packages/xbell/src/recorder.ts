import { XBellEnvRecord } from 'xbell-reporter';

type Env =  EnvConfig['ENV'];

export class Recorder {

  constructor(public records: XBellEnvRecord) {}

  public startCase(env: Env, groupIndex: number, caseIndex: number) {
    this.records[env][groupIndex].cases[caseIndex].status = 'running';
  }

  public finishCase(env: Env, groupIndex: number, caseIndex: number) {
    this.records[env][groupIndex].cases[caseIndex].status = 'successed';
  }

  public wrongCase(env: Env, groupIndex: number, caseIndex: number) {
    this.records[env][groupIndex].cases[caseIndex].status = 'failed';
  }

  public addCaseVideoRecord(env: Env, groupIndex: number, caseIndex: number, filepath: string) {
    this.records[env][groupIndex].cases[caseIndex].videoRecords.push({
      filepath,
    })
  }
}
