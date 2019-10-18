import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ContextService {
	public title$: ReplaySubject<string> = new ReplaySubject<string>(1);

	public setTitle(title: string): void {
		this.title$.next(title);
	}
}
