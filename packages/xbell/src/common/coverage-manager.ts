import { CoverageManager } from '@xbell/coverage';
import { pathManager } from './path-manager';

export const coverageManager = new CoverageManager({
  cwd: pathManager.projectDir,
});
