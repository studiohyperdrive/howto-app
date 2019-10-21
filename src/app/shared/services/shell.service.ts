import { Injectable } from '@angular/core';
import { Observable, merge, of } from 'rxjs';

@Injectable()
export class ShellService {
	public pcs: Map<string, any> = new Map<string, any>(); // TODO: fix this, does nothing atm

	private execa;
	private path;
	private process;
	private waitForLocalhost;

	private root;

	constructor() {
		this.execa = window.nw.require('execa');
		this.path = window.nw.require('path');
		this.process = window.nw.require('process');
		this.waitForLocalhost = window.nw.require('wait-for-localhost');

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
				PATH: this.process.env.PATH.replace(this.path.join(this.process.cwd(), 'node_modules', '.bin'), ''),
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

	public wait({ port }: { port: number }): Observable<any> {
		return new Observable((subscriber) => {
			this.waitForLocalhost({ port })
				.then(() => {
					subscriber.complete();
				})
				.catch((err) => {
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
