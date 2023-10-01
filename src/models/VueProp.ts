class VueProp
{
    public name: string = '';
    public type: string = '';
    public options: string[] = [];
    public required: boolean = false;
    public default: string = '';
    public descriptions: string[] = [];

    constructor() { 
    }

    public addDescription(description: string) : VueProp { 
        this.descriptions.push(description);
        return this;
    }
    public setDescription(description: string) : VueProp {
        this.descriptions = [description];
        return this;
    }

    public setName(name: string) : VueProp {
        this.name = name;
        return this;
    }
    public getName() : string {
        return this.name;
    }

    public setType(type: string) : VueProp {
        this.type = type;
        if(this.type.indexOf('|') > -1) {
            this.options = this.type.split('|').map((item) => {
                return item.trim();
            });
            this.type = 'enum';
        }
        return this;
    }

    public setOptions(options: string[]) : VueProp {
        this.options = options;
        return this;
    }

    public setRequired(required: boolean) : VueProp {
        this.required = required;
        return this;
    }

    public setDefault(value: string) : VueProp {
        this.default = value;
        return this;
    }

    public toLines(): string[]{
        let lines = [] as string[];
        lines.push(`/**`);
        for(let description of this.descriptions) {
            lines.push(`* ${description}`);
        }
        lines.push(`* @type ${this.type === 'enum' ? this.options?.join(' | ') : this.type}`);
        lines.push(`* @required ${this.required}`);
        if(this.default) {
            lines.push(`* @default ${this.default}`);
        }
        lines.push(`*/`);
        lines.push(`${this.name}${this.required ? '' : '?'}: ${this.type === 'enum' ? this.options?.join(' | ') : this.type};`);
        return lines.map((item) => {
            return `        ${item}`;
        });
    }

    public toTypesLine():string{
        // type: { control: { type: 'select'}, options: ['single-line', 'multi-line'] } ,
        let value: string = `        ${this.name}: { `;

        value += 'control: { ';
        if(this.type === 'enum') {
            value += 'type: \'select\''; 
        }
        else if(this.type === 'string') {
            value += 'type: \'text\''; 
        }
        else {
            value += 'type: \'' + this.type + '\''; 
        }  
        value += '}';
        if(this.options.length > 0) {
            value += ', options: [';
            value += this.options.join(', ');
            value += ']';
        }

        value += ' },';
        return value;
    }

    public toString() : string {
        return this.toLines().join('\n');
    }


}


export default VueProp;