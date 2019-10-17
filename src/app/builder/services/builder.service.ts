import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ShellService } from '../../shared/services/shell.service';

@Injectable()
export class BuilderService {
	private path;
	private fs;
	private cli;
	private require;

	constructor(
		@Inject(DOCUMENT) private doc,
		private shell: ShellService,
	) {
		this.path = this.doc.defaultView.nw.require('path');
		this.fs = this.doc.defaultView.nw.require('fs');
		this.cli = this.doc.defaultView.nw.require(this.path.join(this.doc.defaultView.nw.process.cwd(), 'cli.js'));
		this.require = this.doc.defaultView.nw.require;
	}

	public setupProject(name: string): Promise<void> {
		const root = this.path.join(this.require('os').homedir(), 'Projects');

		if (!this.makeDir(root)) {
			return Promise.reject();
		}

		// const schematics = this.cli(this.doc.defaultView.nw.require, { root });

		// return schematics({ args: ['@studiohyperdrive/howto-schematics:styleguide'] });

		// const schematics = path.join(this.doc.defaultView.nw.process.cwd(), 'node_modules', '@angular-devkit', 'schematics-cli', 'bin', 'schematics.js');
		// return cli(this.doc.defaultView.nw.require, schematics, '@studiohyperdrive/howto-schematics:styleguide');

		// const { pcs } = this.shell.exec(path.join(homeFolder, 'Projects'), 'node', schematics, '@studiohyperdrive/howto-schematics:styleguide');

		debugger;

		// const { pcs } = this.shell.exec(root, 'which ng');

		// return pcs as Promise<any>;

		const { pcs: generateApp } = this.shell.exec(root, `which ng && ng new ${name} --routing true --style scss --skipInstall true --defaults true`);

		return generateApp.then(() => {
			const { pcs: generateProject } = this.shell.exec(this.path.join(root, name), 'ng g @studiohyperdrive/howto-schematics:styleguide');

			return generateProject;
		}) as Promise<any>;

		// return new Promise((resolve, reject) => {
		// 	fs.access('~/Projects', fs.constants.F_OK, (err) => {
		// 		debugger;

		// 		resolve();
		// 	});
		// });
	}

	private makeDir(root: string): boolean {
		const statSync = (path) => {
			try {
				this.fs.statSync(path);
				return true;
			} catch (e) {
				return false;
			}
		};

		const mkdirSync = (path) => {
			try {
				this.fs.mkdirSync(path);
				return true;
			} catch (e) {
				return false;
			}
		};

		if (statSync(root)) {
			return true;
		}

		return mkdirSync(root);
	}
}
