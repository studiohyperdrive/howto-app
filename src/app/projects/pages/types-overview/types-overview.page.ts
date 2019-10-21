import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter, first } from 'rxjs/operators';

import { DialogNewTypeComponent } from '../../components/new-type/new-type.component';
import { ProjectService } from '../../services/project.service';
import { Project, UiComponent } from '../../types/project';
import { BuilderType } from 'src/app/builder/builder.types';

@Component({
	templateUrl: './types-overview.page.html',
})
export class TypesOverviewPage implements OnInit, OnDestroy {
	public types = [];

	private project: Project;
	private destroyed$: Subject<boolean> = new Subject<boolean>();

	constructor(
		private dialog: MatDialog,
		private router: Router,
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
			height: '300px',
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

	public handleTypeClicked(type: UiComponent): void {
		this.projectService.openComponent(type.location);
	}
}
