import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Project } from '../types/project';

@Injectable({
	providedIn: 'root',
})
export class ProjectService {
	public projects$: Subject<Project[]> = new Subject<Project[]>();

	private fs;
	private path;
	private projectsRoot;

	constructor() {
		this.fs = window.nw.require('fs');
		this.path = window.nw.require('path');

		const homedir = window.nw.require('os').homedir();

		this.projectsRoot = this.path.join(homedir, 'Projects');
	}

	public getProjects(): void {
		const projectLocations = this.fs.readdirSync(this.projectsRoot)
			.map((path: string) => this.path.join(this.projectsRoot, path))
			.filter((path: string) =>
				!path.startsWith('.')
				&& this.fs.lstatSync(path).isDirectory()
			);

		const projects = projectLocations.reduce((acc, path: string) => {
			const workspace = this.getWorkspace(this.path.join(path, 'angular.json'));

			if (!workspace) {
				return acc;
			}

			return [
				...acc,
				{
					id: Date.now().toString(),
					name: workspace.defaultProject,
					location: path,
				},
			];
		}, []);

		this.projects$.next(projects);
	}

	public getWorkspace(path: string): any {
		if (!this.fs.existsSync(path)) {
			return null;
		}

		return this.readJSON(path);
	}

	private readJSON(path: string): any {
		try {
			const fileContents = this.fs.readFileSync(path, { encoding: 'UTF-8' });

			return JSON.parse(fileContents);
		} catch (e) {
			return null;
		}
	}
}
