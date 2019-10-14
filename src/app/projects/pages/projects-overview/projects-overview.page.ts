import { Component } from '@angular/core';

import { ShellService } from '../../../shared/services/shell.service';

@Component({
	templateUrl: './projects-overview.page.html',
})
export class ProjectsOverviewPage {
	constructor(
		private shell: ShellService,
		private builder: BuilderService,
	) {
		const { cmd, pcs } = this.shell.exec('bash', ['./test.sh']);

		pcs.then((result: string) => {
			console.log(result);
		})
			.catch((error: any) => {
				console.log(error);
			});

		console.log('RUNNING');
		setTimeout(() => {
			this.shell.kill(cmd.pid);
		}, 4000);
	}

	public addProject(): void {
		this.builder.setupProject();
	}
}
