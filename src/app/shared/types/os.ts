export enum BrowserType {
	CHROME,
}

export interface RunningProcess {
	port: number;
	pid: number;
	pcs: any;
}

export interface BrowserOptions {
	type: BrowserType;
	url: string;
}
