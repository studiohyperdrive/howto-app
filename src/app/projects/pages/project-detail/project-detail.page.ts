import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReduxRouterParams } from '@studiohyperdrive/ng-redux-router';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProjectService } from '../../services/project.service';
import { Project } from '../../types/project';
import { ContextService } from '../../../shared/services/context.service';
import { RunningProcess } from '../../../shared/types/os';
import { BuilderType } from '../../../builder/builder.types';

@Component({
	templateUrl: './project-detail.page.html',
})
export class ProjectDetailPage implements OnInit, OnDestroy {
	public project: Project;
	public types = [
		{
			title: 'Overview',
			path: ['.', 'overview'],
		},
		{
			title: 'Atoms',
			path: ['.', `${BuilderType.atom}s`],
		},
		{
			title: 'Molecules',
			path: ['.', `${BuilderType.molecule}s`],
		},
		{
			title: 'Organisms',
			path: ['.', `${BuilderType.organism}s`],
		},
		{
			title: 'Pages',
			path: ['.', `${BuilderType.page}s`],
		},
	];

	private destroyed$: Subject<boolean> = new Subject<boolean>();

	constructor(
		public context: ContextService,
		private projectService: ProjectService,
		private route: ActivatedRoute,
	) {
		this.launchProject = this.launchProject.bind(this);
		this.stopProject = this.stopProject.bind(this);
	}

	public ngOnInit(): void {
		if (this.route.snapshot.params.project) {
			this.context.setAction({
				name: 'launchStyleguideInBrowser',
				exec: this.launchProject,
				stop: this.stopProject,
			});
		}

		this.projectService.project$
			.pipe(
				takeUntil(this.destroyed$),
			)
			.subscribe((project: Project) => {
				this.project = project;
			});

		this.projectService.getProject(this.route.snapshot.params.project);
	}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();

		this.projectService.clearProject(this.project.name);
	}

	private launchProject(): Observable<RunningProcess> {
		return this.projectService.launchProject(this.project.name);
	}

	private stopProject(): Promise<void> {
		return this.projectService.stopProject(this.project.name);
	}
}
