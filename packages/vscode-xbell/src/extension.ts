// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { registerCmdDebugTest } from './debug';
import { TypeScriptCodeLensProvider } from './TypeScriptCodeLensProvider';

const onDidChange: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "xbell-vsc-extension" is now active!');

	// const config = vscode.workspace.getConfiguration('xbell-vsc-extension');
	// const isEnabled = config.get('enabled', true);
	// if (isEnabled) {
	// 	vscode.workspace.workspaceFolders;
	// }
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('xbell-vsc-extension.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from xbell-vsc-extension!');
	// });

	// context.subscriptions.push(disposable);
	context.subscriptions.push(registerCmdDebugTest());

	const codeLensProvider = new TypeScriptCodeLensProvider(onDidChange);

	vscode.languages.registerCodeLensProvider(
		{ scheme: 'file', language: 'typescript' },
		codeLensProvider
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}
