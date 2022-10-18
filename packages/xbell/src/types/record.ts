export type XBellTestCaseStatus =
  | 'successed'
  | 'failed'
  | 'running'
  | 'waiting';

export type XBellError = { name: string; message: string; stack?: string };

export interface XBellWorkerLog {
  type: 'stdout' | 'stderr';
  content: string;
}

export interface XBellTestCaseRecord {
  type: 'case';
  uuid: string;
  filename: string;
  groupDescription?: string;
  caseDescription: string;
  status: XBellTestCaseStatus;
  error?: XBellError;
  coverage?: any;
}

export interface XBellTestGroupRecord {
  type: 'group';
  filename: string;
  uuid: string;
  groupDescription: string;
  cases: XBellTestTaskRecord[];
}

export type XBellTestTaskRecord =
  | XBellTestGroupRecord
  | XBellTestCaseRecord;


export interface XBellTestFileRecord {
  filename: string;
  tasks: XBellTestTaskRecord[];
  logs: XBellWorkerLog[];
  error?: XBellError;
}
