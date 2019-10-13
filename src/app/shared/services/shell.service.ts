// import { ChildProcess } from 'child_process';
import { Injectable } from '@angular/core';

@Injectable()
export class ShellService {
	private cp;

	constructor () {
		this.cp = window.nw.require('child_process');
	}

	public exec (command: string): Promise<string> {
		return new Promise((resolve, reject) => {
			this.cp.exec(command, {}, (error: Error, stdout: string, stderr: string) => {
				if (error) {
					return reject(error);
				}

				if (stderr) {
					return reject(stderr);
				}

				resolve(stdout);
			});
		});
	}
}
