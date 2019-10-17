import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, of, throwError, merge, concat } from 'rxjs';

import { ShellService } from '../../shared/services/shell.service';
import { BuilderStatus } from '../builder.types';

@Injectable()
export class BuilderService {
	private path;
	private fs;
	private require;

	constructor(
		@Inject(DOCUMENT) private doc,
		private shell: ShellService,
	) {
		this.path = this.doc.defaultView.nw.require('path');
		this.fs = this.doc.defaultView.nw.require('fs');
		this.require = this.doc.defaultView.nw.require;
	}

	public setupProject(name: string): Observable<any> {
		const root = this.path.join(this.require('os').homedir(), 'Projects');

		if (!this.makeDir(root)) {
			return throwError(BuilderStatus.MKDIR_FAILED);
		}

		const run = (command: string, options: any, status: BuilderStatus) => merge(
			of(status),
			this.shell.exec(command, options),
		);

		const generateApp = run(`ng new ${name} --routing true --style scss --skipInstall true --defaults true`, {
			cwd: root,
		}, BuilderStatus.INIT_APP);
		const installDependencies = run('npm install --silent', {
			cwd: this.path.join(root, name),
		}, BuilderStatus.INSTALLING_PACKAGES);
		const installSchematics = run('npm link @studiohyperdrive/howto-schematics', {
			cwd: this.path.join(root, name),
		}, BuilderStatus.INSTALLING_SCHEMATICS);
		const generateStyleguide = run(`ng g @studiohyperdrive/howto-schematics:styleguide`, {
			cwd: this.path.join(root, name),
		}, BuilderStatus.INIT_STYLEGUIDE);
		const buildUI = run(`ng build ui`, {
			cwd: this.path.join(root, name),
		}, BuilderStatus.BUILD_UI);

		return concat(
			generateApp,
			installDependencies,
			installSchematics,
			generateStyleguide,
			buildUI,
			of(BuilderStatus.DONE),
		);
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
