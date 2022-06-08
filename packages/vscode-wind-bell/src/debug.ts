import {
  Disposable,
  OutputChannel,
  window,
  commands,
  debug
} from 'vscode';

export const outputChannel: OutputChannel = window.createOutputChannel('Bell');

export function registerCmdDebugTest(): Disposable {
  return commands.registerCommand('extension.debugCase', debugConfig => {
    const json = JSON.stringify(debugConfig, null, 2);
    outputChannel.appendLine('调试中...');
    outputChannel.appendLine(`调试参数: ${json}`);
    debug
      .startDebugging(undefined, debugConfig)
      .then(r => console.log("结果", r));
  });
}