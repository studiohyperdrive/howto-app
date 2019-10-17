import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ShellService {
	public pcs: Map<string, any> = new Map<string, any>();

	private execa;
	private process;

	constructor() {
		this.execa = window.nw.require('execa');
		this.process = window.nw.require('process');
	}

	public exec(command: string, { cwd }: { cwd?: string } = {}): Observable<any> {
		return new Observable((subscriber) => {
			const env = {
				...this.process.env,
				INIT_CWD: cwd,
				PWD: cwd,
				PATH: this.process.env.PATH.replace(`${this.process.cwd()}/node_modules/.bin`, ''),
			};


			this.run(command, env, cwd).then((result) => {
				subscriber.next(result);
				subscriber.complete();
			}).catch((err) => {
				subscriber.error(err);
				subscriber.complete();
			});
		});
	}

	public kill(pid: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			if (!this.pcs.has(pid)) {
				return reject();
			}

			return this.pcs.get(pid).kill();
		});
	}

	private async run(command: string, env: any, cwd: string): Promise<any> {
		const { stdout, stderr } = await this.execa.command(command, { shell: true, cwd, env, extendEnv: false });

		if (stderr) {
			return Promise.reject(stderr);
		}

		return Promise.resolve(stdout);
	}
}
