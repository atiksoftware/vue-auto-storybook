import * as vscode from 'vscode';

class LineRange
{
    public startLine: number;
    public endLine: number;
    public document: vscode.TextDocument;
    
    public content: string = '';
    public lines: string[] = [];


    constructor(document: vscode.TextDocument, startLine: number, endLine: number) {
        this.startLine = startLine;
        this.endLine = endLine - 1;
        this.document = document;

        this.content = this.document.getText();
        for(let i = this.startLine; i <= this.endLine; i++) {
            this.lines.push(
                document.lineAt(i).text
            )
        }
    }

}

export default LineRange;