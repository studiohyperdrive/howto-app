import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'howto-dialog-new-project',
	templateUrl: './new-project.component.html',
})
export class DialogNewProjectComponent implements OnInit {
	public newProjectForm: FormGroup;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<DialogNewProjectComponent>,
	) {}

	public ngOnInit(): void {
		this.newProjectForm = new FormGroup({
			name: new FormControl('', [Validators.required]),
		});
	}

	public onCancel(): void {
		this.dialogRef.close();
	}

	public handleFormSubmit(): void {
		this.dialogRef.close(this.newProjectForm.value.name);
	}
}
