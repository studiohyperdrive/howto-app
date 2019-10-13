import { Component } from '@angular/core';

import { ShellService } from '../../../shared/services/shell.service';

@Component({
	templateUrl: './projects-overview.page.html',
})
export class ProjectsOverviewPage {
	constructor (
		private shell: ShellService
	) {
		this.shell.exec('open ~/Documents/')
			.then((result: string) => {
				console.log(result);
			})
			.catch((error: any) => {
				console.log(error);
			});
	}
}
