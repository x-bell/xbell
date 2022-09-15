import { collector } from './collector';
import type { XBellProject } from '../types';
import { genPropertyDecorator } from '../utils/property';
import { MetaDataType } from '../constants/metadata';
import { genParameterDecorator } from '../utils';
import { ParameterType } from '../constants';


export const Test: () => PropertyDecorator = () => {
  return (target: Object, propertyKey: string | symbol) => {
    collector.classic.setCaseDecorators({
      target,
      propertyKey: propertyKey.toString(),
      decorators: {
        test: true,
      }
    });
  }
}

// export const Inject = genPropertyDecorator(MetaDataType.Inject);

export const Fixtrue = genPropertyDecorator(MetaDataType.Fixtrue);

export const PageParam = genParameterDecorator(ParameterType.Page)

export const DisplayName = (name: string) => {
  const cb: ClassDecorator | PropertyDecorator = (target, propertyKey) => {
    const isClass = typeof propertyKey === 'undefined';
    if (isClass) {
      collector.classic.setGroupDecorators({
        cls: target as Function,
        decorators: {
          displayName: name,
        }
      });
    } else {
      collector.classic.setCaseDecorators({
        target,
        propertyKey: propertyKey.toString(),
        decorators: {
          displayName: name,
        }
      });
    }
  }
  return cb;
}

export const Skip = (): any => {
  return (target: Function | Object, propertyKey?: string | symbol) => {
    const isClass = typeof propertyKey === 'undefined';
    if (isClass) {
      collector.classic.setGroupDecorators({
        cls: target as Function,
        decorators: {
          skip: true,
        }
      });
    } else {
      collector.classic.setCaseDecorators({
        target,
        propertyKey: propertyKey.toString(),
        decorators: {
          skip: true,
        }
      });
    }
  }
}

export const Todo = (): any => {
  return (target: Function | Object, propertyKey?: string | symbol) => {
    const isClass = typeof propertyKey === 'undefined';
    if (isClass) {
      collector.classic.setGroupDecorators({
        cls: target as Function,
        decorators: {
          todo: true,
        }
      });
    } else {
      collector.classic.setCaseDecorators({
        target,
        propertyKey: propertyKey.toString(),
        decorators: {
          todo: true,
        }
      });
    }
  }
}


export const Only = (): any => {
  return (target: Function | Object, propertyKey?: string | symbol) => {
    const isClass = typeof propertyKey === 'undefined';
    if (isClass) {
      collector.classic.setGroupDecorators({
        cls: target as Function,
        decorators: {
          only: true,
        }
      });
    } else {
      collector.classic.setCaseDecorators({
        target,
        propertyKey: propertyKey.toString(),
        decorators: {
          only: true,
        }
      });
    }
  }
}

export const RunProjects = (collect: Array<XBellProjects['names']> | ((project: XBellProject) => boolean)): any => {
  return (target: Function | Object, propertyKey?: string | symbol) => {
    const isClass = typeof propertyKey === 'undefined';
    if (isClass) {
      collector.classic.setGroupDecorators({
        cls: target as Function,
        decorators: {
          runProjects: collect,
        }
      });
    } else {
      collector.classic.setCaseDecorators({
        target,
        propertyKey: propertyKey.toString(),
        decorators: {
          runProjects: collect,
        }
      });
    }
  }
}

export const SkipProjects = (filter: Array<XBellProjects['names']> | ((project: XBellProject) => boolean)): any => {
  return (target: Function | Object, propertyKey?: string | symbol) => {
    const isClass = typeof propertyKey === 'undefined';
    if (isClass) {
      collector.classic.setGroupDecorators({
        cls: target as Function,
        decorators: {
          skipProjects: filter,
        }
      });
    } else {
      collector.classic.setCaseDecorators({
        target,
        propertyKey: propertyKey.toString(),
        decorators: {
          skipProjects: filter,
        }
      });
    }
  }
}

export const Batch = <T>(items: T[]): PropertyDecorator => {
  return (target, propertyKey) => {
    collector.classic.setCaseDecorators({
      target,
      propertyKey: propertyKey.toString(),
      decorators: {
        batch: {
          items
        },
      }
    });
  }
}

export const Each = <T>(items: T[], caseDisplayNameFunction: (item: T) => string): PropertyDecorator => {
  return (target, propertyKey) => {
    collector.classic.setCaseDecorators({
      target,
      propertyKey: propertyKey.toString(),
      decorators: {
        each: {
          items,
          caseDisplayName: caseDisplayNameFunction
        },
      }
    });
  }
}
