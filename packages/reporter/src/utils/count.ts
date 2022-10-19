import type {
  XBellTestTaskRecord,
  XBellTestGroupRecord,
  XBellTestFileRecord,
  XBellTestCaseRecord,
} from '../../lib/index';

type Counter = {
  successed: number;
  failed: number;
  running: number;
}

const DEFAULT_COUNTER: Counter = {
  successed: 0,
  failed: 0,
  running: 0,
}

export function mergeCounter(counterA: Counter, counterB: Counter): Counter {
  return {
    successed: counterA.successed + counterB.successed,
    failed: counterA.failed + counterB.failed,
    running: counterA.running + counterB.running,
  };
}


export function getFilesCounter(files: XBellTestFileRecord[]): Counter {
  return files.reduce<Counter>((acc, file) => {
    return mergeCounter(
      acc,
      getFileCounter(file)
    )
  }, { ...DEFAULT_COUNTER });
}

export function getFileCounter(file: XBellTestFileRecord): Counter {
  return file.tasks.reduce<Counter>((acc, task) => {
    return mergeCounter(acc, getTaskCounter(task));
  }, { ...DEFAULT_COUNTER });
}

export function getTaskCounter(task: XBellTestTaskRecord): Counter {
  if (task.type === 'group') {
    return getGroupCounter(task);
  }

  return getCaseCounter(task);
  
}

export function getGroupCounter(group: XBellTestGroupRecord): Counter {
  return group.cases.reduce<Counter>((acc, task) => {
    return mergeCounter(acc, getTaskCounter(task));
  }, { ...DEFAULT_COUNTER });
}

export function getCaseCounter(c: XBellTestCaseRecord): Counter {
  if (c.status === 'successed') {
    return {
      successed: 1,
      failed: 0,
      running: 0,
    };
  }

  // TODO: runinng
  return {
    successed: 0,
    failed: 1,
    running: 0,
  }
}
