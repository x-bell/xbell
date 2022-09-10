import {
  XBellTestFile,
  XBellTestFileRecord,
  XBellTestTask,
  XBellTestTaskRecord
} from '../types';
import { isCase, isGroup } from './is';

export function eachTask<T extends XBellTestTask | XBellTestTaskRecord>(
  tasks: T[],
  callback: (task: T) => void
) {
  tasks.forEach((task) => {
    if (isCase(task)) {
      callback(task);
    } else if (isGroup(task)) {
      eachTask<T>(task.cases as T[], callback);
    }
  })
}

