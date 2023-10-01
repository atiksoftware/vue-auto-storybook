import Bounds from '../types/Bounds';

const getBounds = (content: string, start: string, end: string, startOffset: number | undefined | null = null): Bounds | null => {
	const startIndex = content.indexOf(start, startOffset || 0);
	
    // if start not found, return null
	if (startIndex === -1) return null;

	// get end index after start index
	const endIndex = content.indexOf(end, startIndex + start.length);
	
    // if end not found, return null
	if (endIndex === -1) return null;

	// return start and end index
	return {
		start: startIndex + start.length,
		end: endIndex
	};
	
}

export default getBounds;