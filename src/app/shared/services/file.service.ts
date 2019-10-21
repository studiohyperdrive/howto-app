import { Injectable } from '@angular/core';

import { FileType } from '../types/file';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class FileService {
	private trash;
	private fs;
	private path;

	constructor() {
		this.trash = window.nw.require('trash');
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

	public makeDir(path: string): boolean {
		const mkdirSync = (targetPath: string) => {
			try {
				this.fs.mkdirSync(targetPath);
				return true;
			} catch (e) {
				return false;
			}
		};

		if (this.pathExists(path)) {
			return true;
		}

		return mkdirSync(path);
	}

	public removeDir(path: string): Promise<void> {
		return this.trash(path);
	}

	public getFileType(path: string): FileType {
		const extension = this.path.extname(path);
		const isUnitTest = (file) => file.includes('.spec') || file.includes('test');

		switch (extension) {
			case '.css':
			case '.scss':
			case '.sass':
				return FileType.styles;
			case '.html':
			case '.html':
				return FileType.template;
			case '.ts':
				return isUnitTest(path) ? FileType.unknown : FileType.component;
			default:
				return FileType.unknown;
		}
	}

	public writeFile(path: string, contents: string, { json = false }: { json?: boolean } = {}): Observable<string> {
		return new Observable((subscriber: Subscriber<any>) => {
			if (!this.pathExists(path)) {
				subscriber.error(`Path does not exist (${path})!`);
				subscriber.complete();

				return;
			}

			try {
				this.fs.writeFileSync(path, json ? JSON.stringify(contents, null, 2) : contents, { encoding: 'UTF-8' });

				subscriber.next(this.readFile(path, { json }));
				subscriber.complete();
			} catch (e) {
				subscriber.error(e);
				subscriber.complete();
			}
		});
	}
}
