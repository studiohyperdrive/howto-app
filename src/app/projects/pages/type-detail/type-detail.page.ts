import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { DialogNewTypeComponent } from '../../components/new-type/new-type.component';
import { ProjectService } from '../../services/project.service';
import { Project, UiComponent } from '../../types/project';
import { BuilderType } from 'src/app/builder/builder.types';

@Component({
	templateUrl: './type-detail.page.html',
})
export class TypeDetailPage implements OnInit, OnDestroy {
	public type: UiComponent;

	private destroyed$: Subject<boolean> = new Subject<boolean>();

	constructor(
		private dialog: MatDialog,
		private router: Router,
		private route: ActivatedRoute,
		private projectService: ProjectService,
	) {}

	public ngOnInit(): void {}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
