import type { XBellTestFile } from '../types';
import { workerContext } from './worker-context';

class StateManager {
  currentFile?: XBellTestFile;

  public getCurrentState() {
    const { filename, projectName } = this.currentFile!;
    return {
      projectName,
      filepath: filename!,
    };
  }

  setCurrentFile(filepath: XBellTestFile) {
    this.currentFile = filepath;
  }
}

export const stateManager = new StateManager;
