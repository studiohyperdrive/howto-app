import { Component, OnInit, OnDestroy } from '@angular/core';

import { ContextService } from '../../../shared/services/context.service';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { replaceAll } from 'src/app/shared/utils/replace-all';

@Component({
	selector: 'howto-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: [
		'./navigation.component.scss',
	],
})
export class NavigationComponent implements OnInit, OnDestroy {
	private destroyed$: Subject<boolean> = new Subject<boolean>();

	constructor(
		public context: ContextService,
		private router: Router,
		private route: ActivatedRoute,
	) {}

	public ngOnInit(): void {
		this.router.events
			.pipe(
				takeUntil(this.destroyed$),
				filter((event: RouterEvent) => event instanceof NavigationEnd),
			)
			.subscribe((event: RouterEvent) => {
				const { data } = this.buildRouteDataFromTree(this.route.snapshot);

				if (data.title) {
					this.context.setTitle(this.parseTitle(data.title, this.route.snapshot));
				}
			});
	}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	public toggleSidebar(): void {
		this.context.toggleSidebar();
	}

	private traverseTree(tree: ActivatedRouteSnapshot, props: string[], values = {}): any {
		const newValues = props.reduce((acc, curr) => ({
			[curr]: {
				...(values && values[curr] ? values[curr] : {}),
				...(tree as any)[curr],
			},
		}), {});

		if (tree.firstChild) {
			return this.traverseTree(tree.firstChild, props, newValues);
		}

		return newValues;
	}

	private buildRouteDataFromTree(route: ActivatedRouteSnapshot): { data?: { [key: string]: string; } } {
		return this.traverseTree(route, ['data']);
	}

	private parseTitle(title: string, route: ActivatedRouteSnapshot): string {
		if (!title.includes('{')) {
			return title;
		}

		const { params } = this.traverseTree(route, ['params']);
		const replaceMap = Object.keys(params).reduce((acc, curr) => ({
			...acc,
			[`{${curr}}`]: params[curr],
		}), {});

		return replaceAll(title, replaceMap);
	}
}
