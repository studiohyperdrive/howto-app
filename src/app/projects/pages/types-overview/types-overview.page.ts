import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { BuilderType } from '../../../builder/builder.types';
import { DialogDeleteProjectComponent } from '../../components/delete-project/delete-project.component';
import { DialogNewTypeComponent } from '../../components/new-type/new-type.component';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../types/project';

@Component({
	templateUrl: './types-overview.page.html',
	styleUrls: [
		'./types-overview.page.scss',
	],
})
export class TypesOverviewPage implements OnInit, OnDestroy {
	public types = [];
	public deleting = false;

	private project: Project;
	private destroyed$: Subject<boolean> = new Subject<boolean>();

	constructor(
		private dialog: MatDialog,
		private router: Router,
		private route: ActivatedRoute,
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
				this.types = [
					{
						title: 'Atoms',
						items: project.types.atoms,
						emptyMessage: 'There are no atoms yet.',
						addMessage: 'Add Atom',
						type: BuilderType.atom,
					},
					{
						title: 'Molecules',
						items: project.types.molecules,
						emptyMessage: 'There are no molecules yet.',
						addMessage: 'Add Molecule',
						type: BuilderType.molecule,
					},
					{
						title: 'Organisms',
						items: project.types.organisms,
						emptyMessage: 'There are no organisms yet.',
						addMessage: 'Add Organism',
						type: BuilderType.organism,
					},
					{
						title: 'Pages',
						items: project.types.pages,
						emptyMessage: 'There are no pages yet.',
						addMessage: 'Add Page',
						type: BuilderType.page,
					},
				];
			});
	}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	public addType(type: BuilderType): void {
		const dialogRef = this.dialog.open(DialogNewTypeComponent, {
			width: '400px',
			data: {
				type,
				project: this.project,
			},
		});

		dialogRef.afterClosed()
			.pipe(
				takeUntil(this.destroyed$),
				filter((typeName: string) => !!typeName),
			)
			.subscribe((typeName: string) => {
				this.router.navigate([type, 'new'], {
					relativeTo: this.route,
					queryParams: {
						name: typeName,
						project: this.project.name,
					},
				});
			});
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
