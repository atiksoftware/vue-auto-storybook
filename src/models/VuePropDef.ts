class VuePropDef
{
    name: string = '';
    type: string = ''; 

    constructor(name?: string, type?: string) {
        if(name) this.name = name;
        if(type) this.type = type;
    }

    public setName(name: string) : VuePropDef {
        this.name = name;
        return this;
    }
    public getName() : string {
        return this.name;
    }

    public setType(type: string) : VuePropDef {
        this.type = type; 
        return this;
    }  
    public getType() : string {
        return this.type;
    }

    public toLines(): string[] {
        return [`${this.name}: ${this.type},`].map((item) => {
            return `        ${item}`;
        });
    }

    public toString(): string {
        return this.toLines().join('\n');
    }

}


export default VuePropDef;