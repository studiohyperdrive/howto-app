import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { SystemService } from './core/services/system.service';
import { SystemStatus } from './core/types/system';
import { DialogInstallCLIComponent } from './core/components/install-cli/install-cli.component';
import { ContextService } from './shared/services/context.service';
import { BuilderProcess } from './builder/builder.types';

@Component({
  selector: 'howto-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor (
	public context: ContextService,
	private system: SystemService,
	private dialog: MatDialog,
	private router: Router,
  ) {}

  public ngOnInit(): void {
	  this.system.verifyHost()
	  	.subscribe(({ status, version }: { status: SystemStatus; version?: string; }) => {
			if (status === SystemStatus.OK) {
				return;
			}

			if (status === SystemStatus.MISSING_CLI) {
				this.promptInstallCLI();
			}

			if (status === SystemStatus.VERSION_MISMATCH) {
				this.promptInstallCLI(version);
			}
		});
	}

	private promptInstallCLI(version?: string): void {
		const dialogRef = this.dialog.open(DialogInstallCLIComponent, {
			width: '400px',
			data: {
				version,
			},
		});

		dialogRef.afterClosed()
			.subscribe((shouldInstall: boolean) => {
				if (shouldInstall) {
					this.router.navigate(['/system'], {
						queryParams: {
							process: BuilderProcess.system,
						},
					});
				}
			});
	}
}
