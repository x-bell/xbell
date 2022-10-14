import {
  XBellTestFileRecord,
  XBellTestTaskRecord,
  XBellWorkerUpdateFileMessage,
  XBellWorkerCollectTestFileMessage,
  XBellWorkerUpdateTaskMessage,
  XBellWorkerLifecycle,
  XBellWorkerLog,
  XBellError,
} from '../types';
import { eachTask } from '../utils/task';
import type { Channel } from '../common/channel';
import { logger } from '../common/logger';
import { XBellCaseRecord, XBellCaseStatus } from 'xbell-reporter';
import { isCase } from '../utils/is';

interface XBellRecorder extends Omit<XBellWorkerLifecycle, 'onExit'> {

}

type XBellRecordSubscriber = (tree: XBellTestFileRecord[]) => void

class Recorder implements XBellRecorder {
  tree: XBellTestFileRecord[];
  subscribers: Array<XBellRecordSubscriber>;
  protected _startTime?: number;

  protected _taskMap = new Map<string, XBellTestTaskRecord>()

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

  onCaseExecuteStart(c: { uuid: string; }): void {
    this._setCaseStatus(c.uuid, 'running');
  }

  onCaseExecuteSuccessed(c: { uuid: string; }): void {
    this._setCaseStatus(c.uuid, 'successed');
  }

  onCaseExecuteFailed(c: { uuid: string; error: XBellError; }): void {
    this._setCaseStatus(c.uuid, 'failed', c.error);
  }

  onLog(data: XBellWorkerLog & { filename: string; }): void {
    const targetFile = this.tree.find(file => file.filename === data.filename)
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

  
  protected _setCaseStatus(uuid: string, status: Exclude<XBellCaseStatus, 'failed'>): void;
  protected _setCaseStatus(uuid: string, status: 'failed', error: XBellError): void;
  protected _setCaseStatus(uuid: string, status: XBellCaseStatus, error?: XBellError): void {
    const task = this._taskMap.get(uuid)
    if (task && isCase(task)) {
      task.status = status;
      if (error) task.error = error;
      this._broadcast();
    }
  }  

  protected _addTestFile(testFile: XBellTestFileRecord) {
    this.tree.push(testFile);
    eachTask(testFile.tasks, (task) => {
      this._taskMap.set(task.uuid, task);
    });
    this._broadcast();
  }
  
  protected _broadcast() {
    this.subscribers.forEach((er) => er(this.tree))
  }
}

export const recorder = new Recorder()
