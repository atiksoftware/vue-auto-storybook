import * as vscode from 'vscode'; 

class VueFile{
    public uri : vscode.Uri;
    public path: string;
    public name: string;
    public extension: string | undefined;
    public category: string | undefined;
    public subCategory: string | undefined;

    public storyBookUri: vscode.Uri;
    public storyBookPath: string;
    public storyBookName: string;
    public storyBookExists: boolean;

    constructor(filePath: string){ 
        this.path = filePath;
        this.uri = vscode.Uri.file(this.path);

        let PS = this.path.split('\\').length > 1 ? '\\' : '/';
 
        let rootPath = this.path.split(`${PS}components`)[0]; 
        let innerPath = this.path.split(`${PS}components${PS}`)[1].split('.vue')[0];
        let innerPathArray = innerPath.split(PS);


        if(innerPathArray.length === 1) {
            this.name = innerPathArray[0]; 
        }
        else if(innerPathArray.length === 2) {
            this.name = innerPathArray[1];
            this.category = innerPathArray[0]; 
        }
        else if(innerPathArray.length === 3) {
            this.name = innerPathArray[2];
            this.category = innerPathArray[0];
            this.subCategory = innerPathArray[1];
        }
        else{
            this.name = 'undefined';
        }

        this.storyBookName	= innerPathArray.join('_'); 
        this.storyBookPath = `${rootPath}${PS}stories${PS}${this.storyBookName}.stories.ts`;
        this.storyBookUri = vscode.Uri.file(this.storyBookPath);
        this.storyBookExists = false;
    }

    async init() : Promise<VueFile>{ 
 
        try {
            await vscode.workspace.fs.stat(this.storyBookUri);
            this.storyBookExists = true; 
        } catch (error) { 
        } 

        return this;
    }

    getComponentName() : string {
        return this.name.split('.vue')[0];
    }

    getCategoryName() : string {
        return this.category + (this.subCategory ? `/${this.subCategory}` : '');
    }

}
 
export default VueFile;