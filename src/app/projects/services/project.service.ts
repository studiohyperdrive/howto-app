import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, merge, concat } from 'rxjs';

import { Project, UiComponent } from '../types/project';
import { BuilderType, BuilderStatus } from '../../builder/builder.types';
import { FileService } from '../../shared/services/file.service';
import { RunnerService } from '../../shared/services/runner.service';
import { BrowserType, RunningProcess } from '../../shared/types/os';
import { ShellService } from '../../shared/services/shell.service';

@Injectable({
	providedIn: 'root',
})
export class ProjectService {
	public project$: ReplaySubject<Project> = new ReplaySubject<Project>(1);
	public projects$: ReplaySubject<Project[]> = new ReplaySubject<Project[]>(1);

	private path;
	private projectsRoot;

	constructor(
		private fs: FileService,
		private runner: RunnerService,
		private shell: ShellService,
	) {
		this.path = window.nw.require('path');

		const homedir = window.nw.require('os').homedir();

		this.projectsRoot = this.path.join(homedir, 'Projects');

		this.launchProject = this.launchProject.bind(this);
	}

	public getProjects(): void {
		const projectLocations = this.fs.readDir(this.projectsRoot, { dirsOnly: true });

		const projects = projectLocations.reduce((acc, path: string) => {
			const workspace = this.getWorkspace(path);

			if (!workspace) {
				return acc;
			}

			return [
				...acc,
				{
					name: workspace.defaultProject,
					location: path,
				},
			];
		}, []);

		this.projects$.next(projects);
	}

	public getProject(name: string): void {
		const projectLocation = this.path.join(this.projectsRoot, name);
		const workspace = this.getWorkspace(projectLocation);

		if (workspace) {
			this.project$.next({
				name: workspace.defaultProject,
				location: projectLocation,
				types: {
					atoms: this.getTypes({ path: projectLocation, workspace, type: BuilderType.atom }),
					molecules: this.getTypes({ path: projectLocation, workspace, type: BuilderType.molecule }),
					organisms: this.getTypes({ path: projectLocation, workspace, type: BuilderType.organism }),
					pages: this.getTypes({ path: projectLocation, workspace, type: BuilderType.page }),
				},
			});
		}
	}

	public clearProject(): void {
		this.project$.complete();
		this.project$ = new ReplaySubject<Project>();
	}

	public getWorkspace(path: string): any {
		return this.fs.readFile(this.path.join(path, 'angular.json'), { json: true });
	}

	public getTypes({ path, type, workspace }: { path: string; type: BuilderType; workspace: any; }): UiComponent[] {
		if (!workspace.projects.ui) {
			return [];
		}

		const typeRoot = this.path.resolve(path, workspace.projects.ui.sourceRoot, 'lib', `${type}s`);

		if (!this.fs.pathExists(typeRoot)) {
			return [];
		}

		const types = this.fs.readDir(typeRoot, { dirsOnly: true });

		return types.map((typePath: string) => ({
			location: typePath,
			name: typePath.split('/').pop(),
			type,
		}));
	}

	public launchProject(project: string): Observable<RunningProcess> {
		const buildUI = this.shell.run({
			cmd: 'ng build ui',
			status: BuilderStatus.BUILD_UI.toString(),
			cwd: project,
		});
		const runStyleguide = this.shell.run({
			cmd: 'ng serve styleguide',
			status: BuilderStatus.RUN_STYLEGUIDE.toString(),
			cwd: project,
		});

		const watchUI = this.shell.run({
			cmd: 'ng build ui --watch',
			status: BuilderStatus.WATCH_UI.toString(),
			cwd: project,
		});

		const launchBrowser = this.runner.launchBrowser({
			type: BrowserType.CHROME,
			url: 'http://localhost:4200', // TODO: get this dynamically
		});

		return merge(
			concat(buildUI, runStyleguide),
			launchBrowser,
			watchUI,
		);
	}

	public openComponent(path: string): Observable<any>  {
		return this.shell.exec(`code ${path}`);
	}
}
