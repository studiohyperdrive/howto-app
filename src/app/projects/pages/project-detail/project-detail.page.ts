import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProjectService } from '../../services/project.service';
import { Project } from '../../types/project';

@Component({
	templateUrl: './project-detail.page.html',
})
export class ProjectDetailPage implements OnInit, OnDestroy {
	public project: Project;

	private destroyed$: Subject<boolean> = new Subject<boolean>();

	constructor(
		private route: ActivatedRoute,
		private projectService: ProjectService,
	) {}

	public ngOnInit(): void {
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
}
