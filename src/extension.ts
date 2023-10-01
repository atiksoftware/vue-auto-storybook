// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// use interface from interfaces.ts
import VueFile from './types/VueFile';
import getVueFiles from './methods/getVueFile';
import getBounds from './methods/getBounds';
import generate from './methods/generate';
 


// const generate = () => {
// 	vscode.window.showInformationMessage('Storybook is generating...');


// 	let vueFile: VueFile = 
// 	// get current file path
// 	let currentFilePath = vscode.window.activeTextEditor?.document.fileName;
// 	// get current file name
// 	let currentFileName = vscode.window.activeTextEditor?.document.fileName.split('/').pop();
// 	// get current file extension
// 	let currentFileExtension = vscode.window.activeTextEditor?.document.fileName.split('.').pop();
// 	// get current category (folder name of current file)
// 	let currentCategory = vscode.window.activeTextEditor?.document.fileName.split('/').slice(-2)[0];
// 	// get current content
// 	let currentContent = vscode.window.activeTextEditor?.document.getText();
	
// 	// get vue props from current content
// 	let propsBounds = getBounds(currentContent || '', 'defineProps<{', '}>(),');
// 	if(!propsBounds) {
// 		vscode.window.showInformationMessage('No props found');
// 		return;
// 	}
// 	let propsContent = currentContent?.substring(propsBounds?.start || 0, propsBounds?.end || 0);

// 	console.log(propsBounds);
// 	console.log(propsContent);
	
// 	vscode.window.showInformationMessage(currentCategory || 'No file selected');
// }


export function activate(context: vscode.ExtensionContext) {
 
	let disposable = vscode.commands.registerCommand('vue-auto-storybook.generate', () => { 
		generate(vscode.window.activeTextEditor?.document.fileName || '');
	});

	context.subscriptions.push(disposable);


	// create a button on left side of vscode
	let button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left );
	button.text = "$(bracket-dot) Auto Storybook";
	button.tooltip = "Auto Storybook!";
	button.command = "vue-auto-storybook.generate";
	button.show();

	// context.subscriptions.push(disposable2);

}

// This method is called when your extension is deactivated
export function deactivate() {}
