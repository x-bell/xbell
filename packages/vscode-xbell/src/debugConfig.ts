import * as path from 'path';

interface CaseConfig {
  fileName: string;
}

export function genCaseConfig({
  fileName,
}: CaseConfig) {
  return {
    type: 'node',
    request: 'launch',
    name: 'Bell 调试',
    runtimeExecutable: 'npx',
    runtimeArgs: [
      "xbell",
      path.basename(fileName),
    ].filter(Boolean)
  };
}
