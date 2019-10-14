import { Logger } from './logger.service';
// import { ChildProcess } from 'child_process';
import { Subject } from 'rxjs';

export class Cmd {
	public cp: any;
	public options: any;
	public pid: string;

	public pid$: Subject<string> = new Subject<string>();

	private spawn;
	private logger: Logger;

	constructor(
		public cmd: string,
		options: any = {},
		public args: any[] = [],
	) {
		const { spawn } = window.nw.require('child_process');

		this.spawn = spawn;
		this.logger = new Logger();
		this.options = {
			// stdio: 'inherit',
			shell: true,
			...options,
		}
	}

	public exec(args: any[] = []): { cmd: Cmd; cp: Promise<string> } {
		const cp = new Promise<string>((resolve, reject) => {
			this.cp = this.spawn(this.cmd, [...this.args, ...args], this.options);

			this.cp.stdout.on('data', (message: Buffer) => {
				this.logger.info(message.toString());
			});

			this.cp.stderr.on('data', (message: string) => {
				this.logger.error(message);
				reject(message);
			});

			this.cp.on('close', (code: number) => {
				if (code === null || code === 0) {
					this.logger.info(`Child process exited with code ${code}.`);
				} else {
					this.logger.error(`Child process exited with code ${code}`);
				}

				resolve(code.toString());
			});

			this.pid = this.cp.pid.toString();
			this.pid$.next(this.pid);
		});

		return {
			cmd: this,
			cp,
		};
	}

	public kill(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			try {
				this.cp.kill();

				resolve();
			} catch (e) {
				reject(e);
			}
		});
	}
}
