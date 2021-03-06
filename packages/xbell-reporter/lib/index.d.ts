export type XBellCaseStatus =
  | 'successed'
  | 'failed'
  | 'running'
  | 'waiting';

export interface XBellErrorRecord {
  originError: Error;
  message?: string;
  codeFrame?: string;
  firstFrame?: string;
}

export interface XBellCaseRecord {
  env: string;
  caseName: string;
  groupName: string;
  browser: string;
  status: XBellCaseStatus;
  videoRecords: {
    filepath: string;
  }[]
  errors?: XBellErrorRecord[];
  steps?: string[];
}

export interface XBellGroupRecord {
  env: string;
  groupName: string;
  browser: string;
  cases: XBellCaseRecord[];
}

export type XBellEnvRecord = Record<string, XBellGroupRecord[]>;

export declare function generateHTML(reportResource: XBellEnvRecord): string;
