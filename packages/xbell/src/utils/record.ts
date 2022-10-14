import type {
  XBellTestFile,
  XBellTestFileRecord,
  XBellTestTask,
  XBellTestTaskRecord,
} from '../types';
import { isCase } from '../utils/is';

export function toTestTaskRecord(task: XBellTestTask): XBellTestTaskRecord {
  if (isCase(task)) {
    return {
      uuid: task.uuid,
      type: task.type,
      caseDescription: task.caseDescription,
      status: task.status,
      groupDescription: task.groupDescription,
      filename: task.filename,
    };
  }

  return {
    groupDescription: task.groupDescription,
    type: task.type,
    filename: task.filename,
    uuid: task.uuid,
    cases: task.cases.map(toTestTaskRecord)
  }
}

export function toTestFileRecord(testFile: XBellTestFile): XBellTestFileRecord {
  return {
    filename: testFile.filename,
    tasks: testFile.tasks.map(toTestTaskRecord),
    logs: [],
  }
}
