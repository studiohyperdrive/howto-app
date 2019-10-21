export enum FileType {
	component = 'component',
	styles = 'styles',
	template = 'template',
	unknown = 'unknown',
}

export interface TypeAssets {
	component?: string;
	styles?: string;
	template?: string;
}

export interface TypeAsset {
	type: FileType;
	content: string;
}
