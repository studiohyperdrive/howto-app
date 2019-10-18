import { Injectable } from "@angular/core";

@Injectable({
	providedIn: 'root',
})
export class FileService {
	private fs;
	private path;

	constructor() {
		this.fs = window.nw.require('fs');
		this.path = window.nw.require('path');
	}

	public readFile(path: string, { json }: { json?: boolean; } = {}): any {
		try {
			const fileContents = this.fs.readFileSync(path, { encoding: 'UTF-8' });

			return json ? JSON.parse(fileContents) : fileContents;
		} catch (e) {
			return null;
		}
	}

	public readDir(path: string, { dirsOnly }: { dirsOnly?: boolean; } = {}): string[] {
		const contents = this.fs.readdirSync(path)
			.map((fileOrFolder: string) => this.path.join(path, fileOrFolder))
			.filter((fileOrFolder: string) => !fileOrFolder.startsWith('.'));

		if (dirsOnly) {
			return contents.filter((fileOrFolder: string) => this.fs.lstatSync(fileOrFolder).isDirectory());
		}

		return contents;
	}

	public pathExists(path: string): boolean {
		return this.fs.existsSync(path);
	}
}
