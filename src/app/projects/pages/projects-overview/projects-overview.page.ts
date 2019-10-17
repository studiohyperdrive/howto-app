import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BuilderService } from '../../../builder/services/builder.service';
import { DialogNewProjectComponent } from '../../components/new-project/new-project.component';

@Component({
	templateUrl: './projects-overview.page.html',
})
export class ProjectsOverviewPage {
	constructor(
		private builder: BuilderService,
		private dialog: MatDialog,
	) {
		// const { cmd, pcs } = this.shell.exec('bash', ['./test.sh']);

		// pcs.then((result: string) => {
		// 	console.log(result);
		// })
		// 	.catch((error: any) => {
		// 		console.log(error);
		// 	});

		// console.log('RUNNING');
		// setTimeout(() => {
		// 	this.shell.kill(cmd.pid);
		// }, 4000);
	}

	public addProject(): void {
		const dialogRef = this.dialog.open(DialogNewProjectComponent);

		dialogRef.afterClosed().subscribe((projectName: string) => {
			this.builder.setupProject(projectName);
		});
	}
}
