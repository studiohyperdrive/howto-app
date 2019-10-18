export const replaceAll = (source: string, replaceMap: { [key: string]: string }, flags: string = 'gi'): string => {
	const pattern = new RegExp(Object.keys(replaceMap).join('|'), flags);

	return source.replace(pattern, (matched: string) => replaceMap[matched.toLowerCase()]);
};
