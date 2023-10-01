import * as vscode from 'vscode'; 

const getDocument = async (uri: vscode.Uri) : Promise<vscode.TextDocument> => { 
    for(let document of vscode.workspace.textDocuments) {
        if(document.uri.toString() === uri.toString()) {
            return document;
        }
    }

    return vscode.workspace.openTextDocument(uri); 
}

export default getDocument;