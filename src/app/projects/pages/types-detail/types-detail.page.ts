import { OnInit, OnDestroy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { ProjectService } from '../../services/project.service';
import { Project } from '../../types/project';
import { BuilderType, BuilderProcess } from '../../../builder/builder.types';
import { DialogNewTypeComponent } from '../../components/new-type/new-type.component';

@Component({
	templateUrl: './types-detail.page.html',
})
export class TypesDetailPage implements OnInit, OnDestroy {
	public project: Project;
	public type: any;

	private builderType: BuilderType;
	private destroyed$: Subject<boolean> = new Subject<boolean>();

	constructor(
		private dialog: MatDialog,
		private projectService: ProjectService,
		private route: ActivatedRoute,
		private router: Router,
	) { }

	public ngOnInit(): void {
		this.projectService.project$
			.pipe(
				takeUntil(this.destroyed$),
			)
			.subscribe((project: Project) => {
				this.project = project;
			});

		this.route.params
			.pipe(
				takeUntil(this.destroyed$),
			)
			.subscribe(({ types }: { types: string; }) => {
				const type = types.slice(0, -1);

				this.builderType = BuilderType[type];
				this.type = {
					title: types.charAt(0).toUpperCase + types.slice(1),
					items: this.project.types[types],
					emptyMessage: `There are no ${types} yet.`,
					addMessage: `Add ${type}`,
				};
			});
	}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	public addType(): void {
		const dialogRef = this.dialog.open(DialogNewTypeComponent, {
			width: '400px',
			data: {
				type: this.builderType,
				project: this.project,
			},
		});

		dialogRef.afterClosed()
			.pipe(
				takeUntil(this.destroyed$),
				filter((typeName: string) => !!typeName),
			)
			.subscribe((typeName: string) => {
				this.router.navigate(['new'], {
					relativeTo: this.route,
					queryParams: {
						typeName,
						type: this.builderType,
						projectName: this.project.name,
						process: BuilderProcess.type,
					},
				});
			});
	}
}
