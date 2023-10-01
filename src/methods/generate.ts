import * as vscode from 'vscode';
 
import VueFile from '../models/VueFile';
import LineRange from '../models/LineRange';
import VueProp from '../models/VueProp';
import VuePropDef from '../models/VuePropDef';
 
import getLineRange from './getLineRange';
import getDocument from './getDocument';
import getVueProps from './getVueProps';
import getVuePropDefs from './getVuePropDefs';
import setLineRange from './setLineRange';

// import VueProp from '../types/VueProp';
// import VuePropDef from '../types/VuePropDef';

// import getVueFile from './getVueFile';
// import getBounds from './getBounds';
 


const generate = async (vueFilePath: string) => {
	vscode.window.showInformationMessage('Storybook is generating...');

    let vueFile: VueFile = await new VueFile(vueFilePath).init() as VueFile;
    if(vueFile.uri === undefined){
        vscode.window.showInformationMessage('No file selected');
        return;
    } 

    let propsLineRange: LineRange | null = getLineRange(
        await getDocument(vueFile.uri),
        'defineProps<{', 
        '}>(),'
    );
    if(propsLineRange === null) {
        vscode.window.showInformationMessage('No props found');
        return;
    }

    let defsLineRange: LineRange | null = getLineRange(
        await getDocument(vueFile.uri),
        '{', 
        '}', 
        propsLineRange?.endLine || 0
    );
    if(defsLineRange === null) {
        vscode.window.showInformationMessage('No defs found');
        return;
    }

    let props : VueProp[] = getVueProps(propsLineRange);
    props.sort((a, b) => { return a.name.localeCompare(b.name); });

    let propDefs : VuePropDef[] = getVuePropDefs(defsLineRange);
    propDefs.sort((a, b) => { return a.name.localeCompare(b.name); });


    let notInDefs : string[] = [];
    for(let prop of props) { 
        if(!propDefs.find((item) => { return item.name === prop.name; })) {
            notInDefs.push(prop.name);
        }
    }
    
    let notInProps : string[] = [];
    for(let def of propDefs) { 
        if(!props.find((item) => { return item.name === def.name; })) {
            notInProps.push(def.name);
        }
    }

    if(notInDefs.length > 0) {
        vscode.window.showWarningMessage(`Props not in defs: ${notInDefs.join(', ')}`); 
    }
    if(notInProps.length > 0) {
        vscode.window.showWarningMessage(`Defs not in props: ${notInProps.join(', ')}`); 
    }

    let newPropsLines : string[] = [];
    props.forEach((prop) => { 
        newPropsLines.push(...prop.toLines());
        newPropsLines.push('');
    });

    let newDefsLines : string[] = [];
    propDefs.forEach((propDef) => { 
        newDefsLines.push(...propDef.toLines()); 
    });
 

    // console.log("Start : ", defsLineRange.startLine);
    // console.log("End : ", defsLineRange.endLine);

    await setLineRange(defsLineRange, newDefsLines);
    await setLineRange(propsLineRange, newPropsLines);


    if(!vueFile.storyBookExists){ 
        const EX_STORY_CONTENT: string = Buffer.from('aW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svdnVlMyc7DQoNCmltcG9ydCAlQ09NUE9ORU5UX05BTUUlIGZyb20gJy4uL2NvbXBvbmVudHMvJUNBVEVHT1JZJS8lQ09NUE9ORU5UX05BTUUlLnZ1ZSc7DQoNCmNvbnN0IG1ldGE6IE1ldGE8dHlwZW9mICVDT01QT05FTlRfTkFNRSU+ID0gew0KCWFyZ1R5cGVzOiB7DQoNCgl9LA0KCWFyZ3M6IHsNCg0KCX0sDQoJY29tcG9uZW50OiAlQ09NUE9ORU5UX05BTUUlLA0KDQoJdGFnczogWydhdXRvZG9jcyddLA0KCXRpdGxlOiAnJUNBVEVHT1JZJS8lQ09NUE9ORU5UX05BTUUlJw0KfTsNCg0KZXhwb3J0IGRlZmF1bHQgbWV0YTsNCnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgJUNPTVBPTkVOVF9OQU1FJT47DQogDQpleHBvcnQgY29uc3QgQmFzZTogU3RvcnkgPSB7DQoJYXJnczogew0KCQkNCgl9DQp9Ow0KICA', 'base64').toString('utf-8');
        // replace all %COMPONENT_NAME% with vueFile.name
        const storyContent = EX_STORY_CONTENT
            .replace(/%COMPONENT_NAME%/g, vueFile.getComponentName())
            .replace(/%CATEGORY%/g, vueFile.getCategoryName()); 
        await vscode.workspace.fs.writeFile(vueFile.storyBookUri, Buffer.from(storyContent, 'utf-8'));
        await vscode.window.showInformationMessage('Storybook generated');
    }



    // [STORYBOOK] [ARGTYPES] [ARGS] [COMPONENT]
    
    const storyDocument = await vscode.workspace.openTextDocument(vueFile.storyBookUri);
    await vscode.window.showTextDocument(storyDocument);

    // get argTypes
    let argTypesLineRange: LineRange | null = getLineRange(
        storyDocument,
        'argTypes: {', 
        'args: {'
    );
    if(argTypesLineRange === null) {
        vscode.window.showInformationMessage('No argTypes found');
        return;
    }
    argTypesLineRange.endLine = argTypesLineRange.endLine - 1;

    // get args
    let argsLineRange: LineRange | null = getLineRange(
        storyDocument,
        'args: {', 
        'component:',
        argTypesLineRange.endLine
    );
    if(argsLineRange === null) {
        vscode.window.showInformationMessage('No args found');
        return;
    }
    argsLineRange.endLine = argsLineRange.endLine - 1;

    // console.log("AT Start : ", argTypesLineRange.startLine);
    // console.log("AT End : ", argTypesLineRange.endLine);
    // console.log("A Start : ", argsLineRange.startLine);
    // console.log("A End : ", argsLineRange.endLine);

    // update args
    await setLineRange(argsLineRange, newDefsLines);

    let newTypesLines : string[] = [];
    props.forEach((prop) => { 
        newTypesLines.push(prop.toTypesLine()); 
    });
    await setLineRange(argTypesLineRange, newTypesLines);


    vscode.window.showInformationMessage('Storybook generated');

}

export default generate;