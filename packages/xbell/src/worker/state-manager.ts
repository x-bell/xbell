import { workerContext } from './worker-context';

class StateManager {
  currentFilepath?: string;

  public getCurrentState() {
    const { projectName } = workerContext.workerData;
    return {
      projectName,
      filepath: this.currentFilepath!,
    };
  }

  setCurrentFilepath(filepath: string) {
    this.currentFilepath = filepath;
  }
}

export const stateManager = new StateManager;
