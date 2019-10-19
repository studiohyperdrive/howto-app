import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ExecutableAction } from '../types/action';
import { tap, finalize } from 'rxjs/operators';
import { RunningProcess } from '../types/os';

@Injectable({
	providedIn: 'root',
})
export class ContextService {
	public title$: BehaviorSubject<string> = new BehaviorSubject<string>('Howto app');
	public sidebarOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public action$: BehaviorSubject<ExecutableAction> = new BehaviorSubject(null);

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
			.subscribe(({ pid }: RunningProcess) => {
				this.action$.next({
					...this.action$.getValue(),
					pid,
				});
			});
	}

	public stopAction(): void {
		this.action$.next({
			...this.action$.getValue(),
			pid: null,
		});
	}
}
