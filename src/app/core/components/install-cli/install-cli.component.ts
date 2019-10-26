import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
	selector: 'howto-install-cli',
	templateUrl: './install-cli.component.html',
})
export class DialogInstallCLIComponent {
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<DialogInstallCLIComponent>,
	) {}

	public onConfirm(): void {
		this.dialogRef.close(true);
	}

	public onCancel(): void {
		this.dialogRef.close(false);
	}
}
