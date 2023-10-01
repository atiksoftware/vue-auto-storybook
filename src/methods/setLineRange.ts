import * as vscode from 'vscode';

import LineRange from "../models/LineRange";

const setLineRange = async (lineRange: LineRange, lines: string[]) => {  
    const startPosition = new vscode.Position(lineRange.startLine, 0);
    const endPosition = new vscode.Position(lineRange.endLine, lineRange.document.lineAt(lineRange.endLine).text.length);
    const editor = await vscode.window.showTextDocument(lineRange.document);
    await editor.edit(editBuilder => {
        editBuilder.replace(new vscode.Range(startPosition, endPosition), lines.join('\n'));
    }); 
}

export default setLineRange;