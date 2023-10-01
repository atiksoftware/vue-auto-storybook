import * as vscode from 'vscode';

import LineRange from '../models/LineRange';

 
const getLineRange = (document: vscode.TextDocument, startText: string, endText: string, startOffset: number = 0) : LineRange | null => { 
    let startLineIndex = -1;
    let endLineIndex = -1;
    
    for(let i =  startOffset; i < document.lineCount; i++) {
        let line = document.lineAt(i);
        if(line.text.includes(startText)) {
            startLineIndex = i; 
        }
        if(startLineIndex > -1 && line.text.includes(endText)) {
            endLineIndex = i;
            break;
        }
    }
    
    if(startLineIndex === -1 || endLineIndex === -1) return null;

    return new LineRange(document, startLineIndex + 1, endLineIndex);
}

export default getLineRange;