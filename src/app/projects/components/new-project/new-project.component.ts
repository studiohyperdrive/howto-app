import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';

import { InstantErrorMatcher } from '../../../shared/utils/error-state-matcher';

@Component({
	selector: 'howto-dialog-new-project',
	templateUrl: './new-project.component.html',
	styleUrls: [
		'./new-project.component.scss',
	],
})
export class DialogNewProjectComponent implements OnInit {
	public newProjectForm: FormGroup;
	public errorStateMatcher = new InstantErrorMatcher();

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<DialogNewProjectComponent>,
	) {}

	public ngOnInit(): void {
		this.newProjectForm = new FormGroup({
			name: new FormControl('', [
				Validators.required,
				this.projectDoesNotExist(),
			]),
		});
	}

	public onCancel(): void {
		this.dialogRef.close();
	}

	public handleFormSubmit(): void {
		this.dialogRef.close(this.newProjectForm.value.name);
	}

	private projectDoesNotExist(): ValidatorFn {
		return (control: FormControl): ValidationErrors => {
			if (control.pristine || !control.value) {
				return null;
			}

			const projects = this.data.projects || [];

			return projects.includes(control.value) ? {
				projectExists: true,
			} : null;
		};
	}
}
