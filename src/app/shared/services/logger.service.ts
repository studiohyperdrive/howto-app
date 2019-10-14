export class Logger {
	public log(...args: any[]): void {
		console.log(...args);
	}

	public info(...args: any[]): void {
		console.info(...args); // tslint:disable-line
	}

	public warn(...args: any[]): void {
		console.warn(...args);
	}

	public error(...args: any[]): void {
		console.error(...args);
	}
}
