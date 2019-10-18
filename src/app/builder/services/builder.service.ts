import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, of, throwError, merge, concat } from 'rxjs';

import { FileService } from '../../shared/services/file.service';
import { ShellService } from '../../shared/services/shell.service';
import { BuilderStatus, BuilderType } from '../builder.types';

@Injectable()
export class BuilderService {
	private path;
	private require;
	private root;

	constructor(
		@Inject(DOCUMENT) private doc,
		private shell: ShellService,
		private fs: FileService,
	) {
		this.path = this.doc.defaultView.nw.require('path');
		this.require = this.doc.defaultView.nw.require;
		this.root = this.path.join(this.require('os').homedir(), 'Projects');
	}

	public setupProject(name: string): Observable<BuilderStatus> {
		if (!this.fs.makeDir(this.root)) {
			return throwError(BuilderStatus.MKDIR_FAILED);
		}

		const generateApp = this.run({
			cmd: `ng new ${name} --routing true --style scss --skipInstall true --defaults true`,
			status: BuilderStatus.INIT_APP,
		});
		const installDependencies = this.run({
			cmd: 'npm install --silent',
			status: BuilderStatus.INSTALLING_PACKAGES,
			project: name,
		});
		const installSchematics = this.run({
			cmd: 'npm link @studiohyperdrive/howto-schematics',
			status: BuilderStatus.INSTALLING_SCHEMATICS,
			project: name,
		});
		const generateStyleguide = this.run({
			cmd: `ng g @studiohyperdrive/howto-schematics:styleguide`,
			status: BuilderStatus.INIT_STYLEGUIDE,
			project: name,
		});
		const buildUI = this.run({
			cmd: `ng build ui`,
			status: BuilderStatus.BUILD_UI,
			project: name,
		});

		return concat(
			generateApp,
			installDependencies,
			installSchematics,
			generateStyleguide,
			buildUI,
			of(BuilderStatus.DONE),
		);
	}

	public atom(project: string, name: string): Observable<any> {
		return this.generateType({
			name,
			project,
			type: BuilderType.atom,
		});
	}

	public molecule(project: string, name: string): Observable<any> {
		return this.generateType({
			name,
			project,
			type: BuilderType.molecule,
		});
	}

	public organism(project: string, name: string): Observable<any> {
		return this.generateType({
			name,
			project,
			type: BuilderType.organism,
		});
	}

	public page(project: string, name: string): Observable<any> {
		return this.generateType({
			name,
			project,
			type: BuilderType.page,
		});
	}

	public run({ cmd, status, project }: { cmd: string; status: BuilderStatus; project?: string; }): Observable<BuilderStatus> {
		return merge(
			of(status),
			this.shell.exec(cmd, {
				cwd: project ? this.path.resolve(this.root, project) : this.root,
			}),
		);
	}

	public generateType({ name, type, project }: { name: string; type: BuilderType; project: string; }): Observable<BuilderStatus> {
		if (!this.fs.pathExists(name)) {
			throwError(BuilderStatus.PROJECT_DOES_NOT_EXIST);
		}

		const generateType = this.run({
			cmd: `ng g @studiohyperdrive/howto-schematics:${type} ${name}`,
			status: BuilderStatus.INIT_COMPONENT,
			project,
		});
		const buildUI = this.run({
			cmd: `ng build ui`,
			status: BuilderStatus.BUILD_UI,
			project,
		});

		return concat(
			generateType,
			buildUI,
			of(BuilderStatus.DONE),
		);
	}
}
