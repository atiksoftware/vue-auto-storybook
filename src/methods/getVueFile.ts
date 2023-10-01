import * as vscode from 'vscode';
import VueFile from '../types/VueFile';


const getVueFile = async (filePath: string) : Promise<VueFile> => {
    console.log('filePath', filePath);
	let rootPath = filePath.split('/components')[0];
	console.log('rootPath', rootPath);
	let innerPath = filePath.split('components/')[1].split('.vue')[0];
	console.log('innerPath', innerPath);
	let innerPathArray = innerPath.split('/');
	console.log('innerPathArray', innerPathArray);

	let file: VueFile = {} as VueFile;
	file.path = filePath;

	// if file is in root folder
	if(innerPathArray.length === 1) {
		file.name = innerPathArray[0]; 
	}
	// if file is in category folder
	else if(innerPathArray.length === 2) {
		file.name = innerPathArray[1];
		file.category = innerPathArray[0]; 
	}
	// if file is in sub category folder
	else if(innerPathArray.length === 3) {
		file.name = innerPathArray[2];
		file.category = innerPathArray[0];
		file.subCategory = innerPathArray[1];
	}

	// get file content
	const content = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
	file.content = content.toString();

	// get storybook file name (join with -)
	file.storyBookName	= innerPathArray.join('_');
	file.storyBookPath = `${rootPath}/stories/${file.storyBookName}.stories.ts`;
	file.storyBookExists = false;
	// codes for check if storybook file exists
	try {
		await vscode.workspace.fs.stat(vscode.Uri.file(file.storyBookPath));
		file.storyBookExists = true;

		// get storybook content
		const storyBookContent = await vscode.workspace.fs.readFile(vscode.Uri.file(file.storyBookPath));
		file.storyBookContent = storyBookContent.toString();
	} catch (error) {
		file.storyBookExists = false;
	}
 
	return file;
}

export default getVueFile;