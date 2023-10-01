import VueProp from '../models/VueProp';
import LineRange from '../models/LineRange';

const getVueProps = (lineRange: LineRange) : VueProp[] => {
    let props: VueProp[] = [] as VueProp[];

    let prop: VueProp = new VueProp();

    for(let line of lineRange.lines) {
        line = line.trim();  

        // start of prop
        if( line.startsWith('*')) {
            if(line.startsWith('*/')) continue;
            let comment = line.replace('/**', '').replace('*', '').trim();
            if(comment.startsWith('@')) {
                let commentArray = comment.split(' ');
                let commentName = commentArray[0].replace('@', '');
                let commentValue = commentArray[1].trim();
                if(commentName === 'type') {
                    prop.setType(commentValue);
                }
                else if(commentName === 'required') { 
                    prop.setRequired(commentValue === 'true');
                }
                else if(commentName === 'default') {
                    prop.setDefault(commentValue);
                }
                else if(commentName === 'description') {
                    prop.setDescription(commentValue);
                }
            }
            else{ 
                prop.addDescription(comment.trim()); 
            }
        }

        // if contain ":" and end with ";"
        if(line.indexOf(':') > -1 && line.endsWith(';')) { 
            let lineArray = line.split(':');
 
            prop.setName(lineArray[0].trim());
            if(prop.getName().endsWith('?')) {
                prop.setRequired(false).setName(prop.getName().replace('?', '')); 
            }
            else{
                prop.setRequired(true);
            }

            prop.setType(lineArray[1].trim().substring(0, lineArray[1].trim().length - 1).trim());

            // prop.type = lineArray[1].trim().split(';')[0].trim(); 
            // if(prop.type.indexOf('|') > -1) {
            //     prop.type = 'enum';
            //     prop.options = lineArray[1].trim().split('|').map((item) => {
            //         return item.trim();
            //     });
            // } 

            props.push(prop); 
            prop = new VueProp();
        }
    }


    return props; 
}

export default getVueProps;