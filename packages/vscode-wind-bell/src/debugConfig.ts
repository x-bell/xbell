interface CaseConfig {
  fileName: string;
  groupName: string;
  caseName?: string;
}
export function genCaseConfig({
  fileName,
  groupName,
  caseName
}: CaseConfig) {
  return {
    type: 'node',
    request: 'launch',
    name: 'Bell 调试',
    runtimeExecutable: 'npx',
    runtimeArgs: [
      "bell",
      "--file",
      fileName,
      "--group",
      groupName,
      caseName && "--case",
      caseName,
    ].filter(Boolean)
  };
}
