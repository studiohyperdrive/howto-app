import { Injectable } from '@angular/core';
import { ReduxRouter, ReduxRouterRoute, ReduxRouterAction, ROUTE_UPDATE, ROUTE_PENDING } from '@studiohyperdrive/ng-redux-router';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ExecutableAction } from '../types/action';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class ContextService {
	public title$: BehaviorSubject<string> = new BehaviorSubject<string>('Howto app');
	public sidebarOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public action$: BehaviorSubject<ExecutableAction> = new BehaviorSubject(null);
	public route$: BehaviorSubject<ReduxRouterRoute> = new BehaviorSubject(null);

	private pendingRoute: ReduxRouterRoute;
	private router: ReduxRouter;

	public get action(): ExecutableAction {
		return this.action$.getValue();
	}

	constructor(
		router: Router,
	) {
		this.router = new ReduxRouter(router);

		this.router.initialize(this.updateRoute.bind(this));
	}

	public setTitle(title: string): void {
		this.title$.next(title);
	}

	public toggleSidebar(force?: boolean): void {
		if (force !== undefined) {
			return this.sidebarOpen$.next(force);
		}

		this.sidebarOpen$.next(!this.sidebarOpen$.getValue());
	}

	public setAction(action: ExecutableAction): void {
		this.action$.next(action);
	}

	public clearAction(): void {
		this.action$.complete();
		this.action$ = new BehaviorSubject<ExecutableAction>(null);
	}

	public runAction(action?: ExecutableAction): void {
		if (action) {
			this.setAction(action);
		}

		const actionToRun = this.action$.getValue();

		actionToRun.exec()
			.pipe(
				finalize(() => {
					this.stopAction();
				}),
			)
			.subscribe();

		this.action$.next({
			...this.action$.getValue(),
			running: true,
		});
	}

	public stopAction(): void {
		const action = this.action$.getValue();

		action.stop();

		this.action$.next({
			...action,
			running: false,
		});
	}

	private updateRoute({ type, route }: ReduxRouterAction): void {
		if (type === ROUTE_PENDING) {
			this.pendingRoute = route;
		}

		if (type === ROUTE_UPDATE) {
			if (this.pendingRoute) {
				this.route$.next(this.pendingRoute);
				this.pendingRoute = null;
			}
		}
	}
}
