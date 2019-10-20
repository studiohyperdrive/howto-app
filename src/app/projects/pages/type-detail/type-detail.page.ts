import { Component, OnInit, OnDestroy } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

// import { ProjectService } from '../../services/project.service';
import { UiComponent, Project } from '../../types/project';
import { component } from './mocks/component';
import { template } from './mocks/template';
import { styling } from './mocks/styling';
// import { takeUntil } from 'rxjs/operators';

const EDITOR_THEME = 'vs-dark';

@Component({
	templateUrl: './type-detail.page.html',
	styleUrls: [
		'./type-detail.page.scss',
	],
})
export class TypeDetailPage implements OnInit, OnDestroy {
	public type: UiComponent;

	private destroyed$: Subject<boolean> = new Subject<boolean>();

	public componentEditor = {
		theme: EDITOR_THEME,
		language: 'typescript',
		content: component,
	};

	public templateEditor = {
		theme: EDITOR_THEME,
		language: 'html',
		content: template,
	};

	public stylingEditor = {
		theme: EDITOR_THEME,
		language: 'scss',
		content: styling,
	};

	constructor(
		// private dialog: MatDialog,
		// private router: Router,
		// private route: ActivatedRoute,
		// private projectService: ProjectService,
	) {}

	public ngOnInit(): void {
		// this.projectService.project$
		// 	.pipe(takeUntil(this.destroyed$))
		// 	.subscribe((project: Project) => {
		// 		debugger;
		// 	});
	}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
