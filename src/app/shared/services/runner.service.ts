import { Injectable } from '@angular/core';

import { BrowserType, BrowserOptions, RunningProcess } from '../types/os';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class RunnerService {
	private cl;

	constructor() {
		this.cl = window.nw.require('chrome-launcher');
	}

	public launchBrowser({
		type,
		url,
	}: BrowserOptions): Observable<RunningProcess> {
		switch (type) {
			case BrowserType.CHROME:
				return this.launchChrome(url);
		}
	}

	public launchChrome(url: string): Observable<RunningProcess> {
		return new Observable<RunningProcess>((subscriber: Subscriber<RunningProcess>) => {
			this.cl.launch({
				startingUrl: url,
			})
				.then(({ port, kill, pid, process: pcs}) => {
					subscriber.next({
						port,
						pid,
						pcs,
					});

					pcs.on('exit', (code) => {
						if (code > 0) {
							subscriber.error(`Process exited with code (${code})`);
						} else {
							subscriber.complete();
						}
					});
				})
				.catch((err) => {
					subscriber.error(err);
					subscriber.complete();
				});
		});
	}
}
