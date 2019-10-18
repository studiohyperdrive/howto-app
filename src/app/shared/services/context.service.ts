import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class ContextService {
	public title$: BehaviorSubject<string> = new BehaviorSubject<string>('Howto app');
	public sidebarOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	public setTitle(title: string): void {
		this.title$.next(title);
	}

	public toggleSidebar(force?: boolean): void {
		if (force !== undefined ){
			return this.sidebarOpen$.next(force);
		}

		this.sidebarOpen$.next(!this.sidebarOpen$.getValue());
	}
}
