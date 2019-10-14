// import { ChildProcess } from 'child_process';
import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';

import { Cmd } from './cmd';

@Injectable()
export class ShellService {
	public pcs: Map<string, any> = new Map<string, any>();

	public exec(command: string, ...args: any[]): { pcs: Promise<string>, cmd: Cmd } {
		const cmd = new Cmd(command, {}, args);

		cmd.pid$
			.pipe(
				first(),
			)
			.subscribe((pid: string) => {
				this.pcs.set(pid, cmd);
			});

		const { cp } = cmd.exec();
		const pcs = new Promise<string>((resolve, reject) => {
			cp
				.then((response: any) => {
					this.pcs.delete(cmd.pid);

					resolve(response);
				}).catch((err: any) => {
					this.pcs.delete(cmd.pid);

					reject(err);
				});
		});


		return {
			pcs,
			cmd,
		};
	}

	public kill(pid: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			if (!this.pcs.has(pid)) {
				return reject();
			}

			return this.pcs.get(pid).kill();
		});
	}
}
