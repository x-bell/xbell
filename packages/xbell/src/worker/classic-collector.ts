import type { XBellCaseTagInfo, XBellProject, XBellTestCase, XBellTestCaseClassic, XBellTestFile, XBellTestGroup } from '../types';
import type { Collector } from './collector';

export interface XBellTestGroupClassic {
  displayName?: string;
}

export interface XBellTestGroupDecorators {
  skip?: boolean;
  todo?: boolean;
  only?: boolean;
  displayName?: string;
  skipProjects?: string[] | ((project: XBellProject) => boolean);
  runProjects?: string[] | ((project: XBellProject) => boolean);
}

export interface XBellTestCaseDecorators {
  propertyKey: string;
  skip?: boolean;
  todo?: boolean;
  only?: boolean;
  each?: {
    items: any[];
    caseDisplayName: ((item: any) => string);
  }
  batch?: {
    items: any[];
  }
  displayName?: string;
  test?: boolean;
  skipProjects?: string[] | ((project: any) => boolean);
  runProjects?: string[] | ((project: any) => boolean);
}

interface ClassInfo {
  decorators: XBellTestGroupDecorators;
  cases: XBellTestCaseDecorators[];
}

export class ClassicCollector {
  currentFile?: XBellTestFile;
  decoratorsMapByCls: Map<Function, ClassInfo> = new Map();

  constructor(protected collector: Collector) {

  }

  startFileCollection(file: XBellTestFile) {
    this.currentFile = file;
  }

  finishFileCollection() {
    this.genTasks()
    this.currentFile = undefined;
  }

  setCaseDecorators({
    target,
    propertyKey,
    decorators
  }: {
    target: Object;
    propertyKey: string;
    decorators: Omit<XBellTestCaseDecorators, 'propertyKey'>
  }) {
    const clsInfo = this.ensureClsDecoratorMap({ cls: target.constructor })
    const existedCase = clsInfo.cases.find(c => c.propertyKey === propertyKey);
    const c: XBellTestCaseDecorators = existedCase ?? {
      propertyKey,
    };
    if (!existedCase) {
      clsInfo.cases.push(c);
    } else {
      Object.assign(c, decorators);
    }
  }

  setGroupDecorators({
    cls,
    decorators
  }: {
    cls: Function;
    decorators: XBellTestGroupDecorators
  }) {
    const clsInfo = this.ensureClsDecoratorMap({ cls });
    clsInfo.decorators = {
      ...clsInfo.decorators,
      ...decorators,
    }
  }

  protected ensureClsDecoratorMap({
    cls
  }: {
    cls: Function
  }) {
    if (!this.decoratorsMapByCls.has(cls)) {
      this.decoratorsMapByCls.set(cls, {
        decorators: {},
        cases: [],
      });
    }

    return this.decoratorsMapByCls.get(cls)!;
  }

  protected genTasks() {
    const entries = this.decoratorsMapByCls.entries();
    const tasks: XBellTestGroup[] = []
    for (const [cls, clsInfo] of entries) {
      const group = this.createGroup(cls, clsInfo);
      const cases = clsInfo.cases.reduce<XBellTestCaseClassic[]>((acc, caseDecorators) => {
        return [
          ...acc,
          ...this.createCases(cls, caseDecorators)
        ]
      }, []);

      group.cases = cases;
      tasks.push(group);
    }

    return tasks;
  }

  protected createGroup(cls: Function, clsInfo: ClassInfo): XBellTestGroup {
    return {
      type: 'group',
      uuid: this.collector.genUuid(),
      config: {},
      options: {}, // TODO: gorup options
      runtimeOptions: {
        browserCallbacks: []
      },
      cases: [],
      filename: this.currentFile!.filename,
      groupDescription: clsInfo.decorators.displayName ?? cls.name,
    };
  }

  protected createCases(cls: Function, caseDecorators: XBellTestCaseDecorators): XBellTestCaseClassic[] {
    if (caseDecorators.each) {
      return caseDecorators.each.items.map((item, index) => {
        const c: XBellTestCaseClassic = {
          type: 'case',
          uuid: this.collector.genUuid(),
          config: {},
          options: {
            skip: caseDecorators.skip,
            todo: caseDecorators.todo,
            batch: caseDecorators.batch,
            only: caseDecorators.only,
            each: {
              item,
              index,
            },
          },
          runtimeOptions: {
            browserCallbacks: [],
          },
          caseDescription: caseDecorators.displayName ?? caseDecorators.propertyKey,
          filename: this.currentFile!.filename,
          propertyKey: caseDecorators.propertyKey,
          runtime: 'node',
          status: 'waiting',
          class: cls,
        };

        return c;
      });
    }

    return [{
      type: 'case',
      uuid: this.collector.genUuid(),
      config: {},
      options: {
        skip: caseDecorators.skip,
        todo: caseDecorators.todo,
        batch: caseDecorators.batch,
        only: caseDecorators.only,
      },
      runtimeOptions: {
        browserCallbacks: [],
      },
      caseDescription: caseDecorators.displayName ?? caseDecorators.propertyKey,
      filename: this.currentFile!.filename,
      propertyKey: caseDecorators.propertyKey,
      runtime: 'node',
      status: 'waiting',
      class: cls,
    }];
  }
}
