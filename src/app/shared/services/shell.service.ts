import { Injectable } from '@angular/core';
import { Observable, merge, of } from 'rxjs';
import { Options } from 'del';

@Injectable()
export class ShellService {
	public pcs: Map<string, any> = new Map<string, any>(); // TODO: fix this, does nothing atm

	private execa;
	private path;
	private process;
	private del;

	private root;

	constructor() {
		this.execa = window.nw.require('execa');
		this.path = window.nw.require('path');
		this.process = window.nw.require('process');
		this.del = window.nw.require('del');

		this.root = this.path.join(window.nw.require('os').homedir(), 'Projects');
	}

	public run<T = any>({ cmd, status, cwd }: { cmd: string; status: string; cwd?: string; }): Observable<T> {
		return merge(
			of(status),
			this.exec(cmd, {
				cwd: cwd ? this.path.resolve(this.root, cwd) : this.root,
			}),
		);
	}

	public exec(command: string, { cwd }: { cwd?: string } = {}): Observable<any> {
		return new Observable((subscriber) => {
			const env = {
				...this.process.env,
				INIT_CWD: cwd,
				PWD: cwd,
				PATH: this.process.env.PATH.replace(`${this.process.cwd()}/node_modules/.bin`, ''),
			};


			this.runCommand(command, env, cwd).then((result) => {
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

	public rm(path: string): Promise<any> {
		return this.del(path, {
			force: true,
		} as Options);
	}

	private async runCommand(command: string, env: any, cwd: string): Promise<any> {
		const pcs = this.execa.command(command, { shell: true, cwd, env, extendEnv: false });
		pcs.stdout.on('data', (message) => {
			console.log(message.toString());
		});

		const { stdout, stderr } = await pcs;

		if (stderr) {
			return Promise.reject(stderr);
		}

		return Promise.resolve(stdout);
	}
}
