export function handleEnterKey(event : any, callback : (event? : any) => void) : void {
	if (event.key === 'Enter') {
		callback(event);
	}
}

export const HEK = handleEnterKey;
