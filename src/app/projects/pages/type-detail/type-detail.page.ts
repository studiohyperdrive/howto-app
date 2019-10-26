import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, map, switchMap, tap, finalize } from 'rxjs/operators';

import { UiComponent, Project } from '../../types/project';
import { ProjectService } from '../../services/project.service';
import { TypeAssets } from '../../../shared/types/file';
import { isNil } from '../../../shared/utils/is-nil';

const EDITOR_THEME = 'vs-dark';

@Component({
	templateUrl: './type-detail.page.html',
	styleUrls: [
		'./type-detail.page.scss',
	],
})
export class TypeDetailPage implements OnInit, OnDestroy {
	public type: UiComponent;
	public editorVisible = false;
	public saving = false;

	private destroyed$: Subject<boolean> = new Subject<boolean>();

	public componentEditor = {
		theme: EDITOR_THEME,
		language: 'typescript',
		content: null,
		enabled: false,
	};

	public templateEditor = {
		theme: EDITOR_THEME,
		language: 'html',
		content: null,
		enabled: false,
	};

	public stylesEditor = {
		theme: EDITOR_THEME,
		language: 'scss',
		content: null,
		enabled: false,
	};

	constructor(
		private route: ActivatedRoute,
		private projectService: ProjectService,
	) {}

	public ngOnInit(): void {
		this.projectService.project$
			.pipe(
				takeUntil(this.destroyed$),
				map((project: Project) => project.types[this.route.snapshot.params.types]),
				map((types: UiComponent[]) => types.find((type: UiComponent) => type.name === this.route.snapshot.params.id)),
				tap((type: UiComponent) => {
					this.type = type;
				}),
				switchMap((type: UiComponent) => this.projectService.getTypeAssets(type)),
			)
			.subscribe((assets: TypeAssets) => {
				this.updateAssets(assets);
			});
	}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	public saveType(): void {
		this.saving = true;

		this.projectService.updateTypeAssets(this.type, {
			component: this.componentEditor.content,
			styles: this.stylesEditor.content,
			template: this.templateEditor.content,
		}).pipe(
			takeUntil(this.destroyed$),
			finalize(() => {
				setTimeout(() => {
					this.saving = false;
				}, 1000);
			}),
		).subscribe((assets: TypeAssets) => {
			this.updateAssets(assets);
		});
	}

	public openInCode(): void {
		this.projectService.openInCode(this.type.location).subscribe();
	}

	public handleTabChanged({ index }: { index: number; }): void {
		this.editorVisible = index > 0;
	}

	private updateAssets({ component, styles, template }: TypeAssets): void {
		if (!isNil(component)) {
			this.componentEditor.content = component;
			this.componentEditor.enabled = true;
		}

		if (!isNil(styles)) {
			this.stylesEditor.content = styles;
			this.stylesEditor.enabled = true;
		}

		if (!isNil(template)) {
			this.templateEditor.content = template;
			this.templateEditor.enabled = true;
		}
	}
}
