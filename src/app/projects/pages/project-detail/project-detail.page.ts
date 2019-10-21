import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProjectService } from '../../services/project.service';
import { Project } from '../../types/project';
import { ContextService } from '../../../shared/services/context.service';
import { RunningProcess } from 'src/app/shared/types/os';

@Component({
	templateUrl: './project-detail.page.html',
})
export class ProjectDetailPage implements OnInit, OnDestroy {
	public project: Project;

	private destroyed$: Subject<boolean> = new Subject<boolean>();

	constructor(
		private route: ActivatedRoute,
		private projectService: ProjectService,
		private context: ContextService,
	) {
		this.launchProject = this.launchProject.bind(this);
		this.stopProject = this.stopProject.bind(this);
	}

	public ngOnInit(): void {
		this.context.setAction({
			name: 'launchStyleguideInBrowser',
			exec: this.launchProject,
			stop: this.stopProject,
		});

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

		this.projectService.clearProject();
	}

	private launchProject(): Observable<RunningProcess> {
		return this.projectService.launchProject(this.project.name);
	}

	private stopProject(): void {
		return this.projectService.stopProject(this.project.name);
	}
}
