import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DialogDeleteProjectComponent } from '../../components/delete-project/delete-project.component';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../types/project';

@Component({
	templateUrl: './types-overview.page.html',
	styleUrls: [
		'./types-overview.page.scss',
	],
})
export class TypesOverviewPage implements OnInit, OnDestroy {
	public deleting = false;

	private project: Project;
	private destroyed$: Subject<boolean> = new Subject<boolean>();

	constructor(
		private dialog: MatDialog,
		private router: Router,
		private projectService: ProjectService,
		private ngZone: NgZone,
	) {}

	public ngOnInit(): void {
		this.projectService.project$
			.pipe(
				takeUntil(this.destroyed$),
			)
			.subscribe((project: Project) => {
				this.project = project;
			});
	}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	public handleProjectClicked(project: Project): void {
		this.projectService.openInCode(project.location).subscribe();
	}

	public handleProjectDeleted(project: Project): void {
		const dialogRef = this.dialog.open(DialogDeleteProjectComponent, {
			width: '400px',
		});

		dialogRef.afterClosed()
			.pipe(
				takeUntil(this.destroyed$),
			)
			.subscribe((shouldDelete: boolean) => {
				if (shouldDelete) {
					this.deleting = true;
					this.projectService.deleteProject(project.location)
						.then(() => {
							this.ngZone.run(() => {
								this.router.navigate(['/projects']);
							});
						})
						.catch(() => {
							this.deleting = false;
						});
				}
			});
	}
}
