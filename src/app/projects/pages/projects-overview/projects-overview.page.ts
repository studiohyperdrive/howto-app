import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { DialogNewProjectComponent } from '../../components/new-project/new-project.component';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../types/project';
import { LoaderType } from '../../../shared/types/loader';

@Component({
	templateUrl: './projects-overview.page.html',
	styleUrls: [
		'./projects-overview.page.scss',
	],
})
export class ProjectsOverviewPage implements OnInit, OnDestroy {
	public projects: Project[] = [];
	public loading = false;
	public statusLoader: LoaderType = LoaderType.SWIRL;

	private destroyed$: Subject<boolean> = new Subject<boolean>();

	constructor(
		private dialog: MatDialog,
		private router: Router,
		private route: ActivatedRoute,
		private projectService: ProjectService,
	) {}

	public ngOnInit(): void {
		this.projectService.projects$
			.pipe(
				takeUntil(this.destroyed$),
			)
			.subscribe((projects: Project[]) => {
				this.projects = projects;
				this.loading = false;
			});

		this.projectService.getProjects();
	}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	public addProject(): void {
		const dialogRef = this.dialog.open(DialogNewProjectComponent, {
			height: '300px',
			width: '400px',
			data: {
				projects: this.projects.map((project: Project) => project.name),
			},
		});

		dialogRef.afterClosed()
			.pipe(
				takeUntil(this.destroyed$),
				filter((projectName: string) => !!projectName),
			)
			.subscribe((projectName: string) => {
				this.router.navigate(['.', 'new'], {
					relativeTo: this.route,
					queryParams: {
						projectName,
					},
				});
			});
	}

	public handleProjectClicked(project: Project): void {
		this.projectService.openInCode(project.location);
	}

	public handleProjectDeleted(project: Project): void {
		this.loading = true;
		this.projectService.deleteProject(project.location);
	}
}
