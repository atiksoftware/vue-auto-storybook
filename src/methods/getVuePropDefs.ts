import VuePropDef from '../models/VuePropDef';
import LineRange from '../models/LineRange';

const getVuePropDefs = (lineRange: LineRange) : VuePropDef[] => {
    let defs: VuePropDef[] = [] as VuePropDef[]; 

    for(let line of lineRange.lines) { 
        if(line.trim().length === 0) continue;

        let lineArray = line.trim().split(':');

        let def: VuePropDef = new VuePropDef();
        
        def.setName(lineArray[0].trim());
        def.setType(lineArray[1].trim());
        
        if(def.getType().endsWith(';') || def.getType().endsWith(',')) {
            def.setType(def.getType().substring(0, def.getType().length - 1));
        }
        defs.push(def);
    }
 
    return defs; 
}

export default getVuePropDefs;