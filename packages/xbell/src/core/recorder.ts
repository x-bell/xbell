import {
  XBellTestFileRecord,
  XBellTestTaskRecord,
  XBellWorkerUpdateFileMessage,
  XBellWorkerCollectTestFileMessage,
  XBellWorkerUpdateTaskMessage,
  XBellWorkerLifecycle,
  XBellWorkerLog,
  XBellError,
  XBellTestCaseStatus,
  XBellTestCaseLifecycle
} from '../types';
import { eachTask } from '../utils/task';
import type { Channel } from '../common/channel';
import { logger } from '../common/logger';
import { isCase } from '../utils/is';
import { coverageManager } from '../common/coverage-manager';
import { htmlReporter } from '../common/html-reporter';
import { formatError } from '../utils/error';
import { configurator } from '../common/configurator';

interface XBellRecorder extends Omit<XBellWorkerLifecycle, 'onExit'> {

}

type XBellRecordSubscriber = (tree: XBellTestFileRecord[]) => void

class Recorder implements XBellRecorder {
  tree: XBellTestFileRecord[];
  subscribers: Array<XBellRecordSubscriber>;
  protected _startTime?: number;

  protected _taskMap = new Map<string, XBellTestTaskRecord>();

  constructor() {
    this.tree = [];
    this.subscribers = [];
  }

  setStartTime(date: number) {
    this._startTime = date;
  }

  getStartTime() {
    return this._startTime!;
  }

  onFileCollectSuccesed(file: XBellTestFileRecord): void {
    this._addTestFile(file);
  }

  onFileCollectFailed(file: XBellTestFileRecord): void {
    this._addTestFile(file) ;
  }

  onCaseExecuteStart(c: Parameters<XBellWorkerLifecycle['onCaseExecuteStart']>[0]): void {
    this._setCaseStatus(c.uuid, 'running');
  }

  onCaseExecuteSuccessed(c: Parameters<XBellWorkerLifecycle['onCaseExecuteSuccessed']>[0]): void {
    this._setCaseStatus(c.uuid, 'successed', { coverage: c.coverage, videos: c.videos });
  }

  onCaseExecuteSkipped(c: { uuid: string; }): void {
    this._setCaseStatus(c.uuid, 'skipped')
  }

  onCaseExecuteTodo(c: { uuid: string; }): void {
    this._setCaseStatus(c.uuid, 'todo')
  }

  async onCaseExecuteFailed(c: Parameters<XBellWorkerLifecycle['onCaseExecuteFailed']>[0]) {
    let error = c.error;
    try {
      error = await formatError(c.error, {
        browserTestFunction: c.browserTestFunction,
      });
    } catch {}

    this._setCaseStatus(c.uuid, 'failed', { error, videos: c.videos });
  }

  async onAllDone() {
    await coverageManager.generateReport();
    htmlReporter.generateReport(this.tree);
    // TODO: exit when all done
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }

  onLog(data: XBellWorkerLog & { filename: string; projectName: string; }): void {
    const targetFile = this.tree.find(file => file.filename === data.filename && file.projectName === data.projectName);
    if (targetFile) {
      targetFile.logs.push({
        type: data.type,
        content: data.content,
      });
    }
  }

  subscribe(er: XBellRecordSubscriber) {
    this.subscribers.push(er);
  }

  unsubscribe(er: XBellRecordSubscriber) {
    this.subscribers = this.subscribers.filter(item => item !== er);
  }

  
  protected _setCaseStatus(uuid: string, status: Exclude<XBellTestCaseStatus, 'failed'>, opts?: { coverage?: any, videos?: string[] }): void;
  protected _setCaseStatus(uuid: string, status: 'failed', opts?: { error: XBellError, videos?: string[] }): void;
  protected _setCaseStatus(uuid: string, status: XBellTestCaseStatus, { error, coverage, videos }: { error?: XBellError, coverage?: any, videos?: string[] } = {}): void {
    const task = this._taskMap.get(uuid)
    if (task && isCase(task)) {
      task.status = status;
      if (coverage) {
        task.coverage = coverage;
        coverageManager.addCoverage(coverage);
      }
      if (videos?.length) {
        task.videos = videos;
      }
      if (error) task.error = error;
      this._broadcast();
    }
  }  

  protected _addTestFile(testFile: XBellTestFileRecord) {
    this.tree = this.sortByProject([
      ...this.tree,
      testFile
    ]);
    eachTask(testFile.tasks, (task) => {
      this._taskMap.set(task.uuid, task);
    });
    this._broadcast();
  }

  protected sortByProject(files: XBellTestFileRecord[]) {
    const { projects } = configurator.globalConfig;
    if (projects.length < 2) {
      return files;
    }
    const indexMap = projects.reduce<Record<string, number>>((acc, project, index) => {
      acc[project.name] = index;
      return acc;
    }, {});

    return files.reduce<XBellTestFileRecord[][]>((groupList, file) => {
      const groupIndex = indexMap[file.projectName];
      if (!groupList[groupIndex]) groupList[groupIndex] = [];
      groupList[groupIndex].push(file);
      return groupList;
    }, []).reduce((acc, group) => [...acc, ...group], []);
  }
  
  protected _broadcast() {
    this.subscribers.forEach((er) => er(this.tree))
  }
}

export const recorder = new Recorder();
