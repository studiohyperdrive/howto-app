import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { DialogNewProjectComponent } from '../../components/new-project/new-project.component';

@Component({
	templateUrl: './projects-overview.page.html',
})
export class ProjectsOverviewPage implements OnInit, OnDestroy {
	private destroyed$: Subject<boolean> = new Subject<boolean>();

	constructor(
		private dialog: MatDialog,
		private router: Router,
		private route: ActivatedRoute,
		private projectService: ProjectService,
	) {}

	public ngOnInit(): void {
	}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	public addProject(): void {
		const dialogRef = this.dialog.open(DialogNewProjectComponent, {
			height: '300px',
			width: '400px',
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
}
