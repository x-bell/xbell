import type {
  XBellTestTask,
  XBellTestTaskRecord,
  XBellTestGroup,
  XBellTestGroupRecord,
  XBellTestCase,
  XBellTestCaseRecord,
} from '../types';

export function isGroup(task: XBellTestTask): task is XBellTestGroup;
export function isGroup(task: XBellTestTaskRecord): task is XBellTestGroupRecord;
export function isGroup(task: XBellTestTask | XBellTestTaskRecord): task is XBellTestGroup | XBellTestGroupRecord {
  return task.type === 'group';
}

export function isCase(task: XBellTestTask): task is XBellTestCase<any, any>;
export function isCase(task: XBellTestTaskRecord): task is XBellTestCaseRecord;
export function isCase(task: XBellTestTask | XBellTestTaskRecord): task is (XBellTestCase<any, any> | XBellTestCaseRecord) {
  return task.type === 'case';
}
