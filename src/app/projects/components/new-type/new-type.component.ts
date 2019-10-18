import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';

import { InstantErrorMatcher } from '../../../shared/utils/error-state-matcher';

@Component({
	selector: 'howto-dialog-new-type',
	templateUrl: './new-type.component.html',
	styleUrls: [
		'./new-type.component.scss',
	],
})
export class DialogNewTypeComponent implements OnInit {
	public newTypeForm: FormGroup;
	public errorStateMatcher = new InstantErrorMatcher();

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<DialogNewTypeComponent>,
	) {}

	public ngOnInit(): void {
		this.newTypeForm = new FormGroup({
			name: new FormControl('', [
				Validators.required,
				this.typeDoesNotExist(),
			]),
		});
	}

	public onCancel(): void {
		this.dialogRef.close();
	}

	public handleFormSubmit(): void {
		this.dialogRef.close(this.newTypeForm.value.name);
	}

	private typeDoesNotExist(): ValidatorFn {
		return (control: FormControl): ValidationErrors => {
			if (control.pristine || !control.value) {
				return null;
			}

			const types = this.data.project.types[`${this.data.type}s`] || [];

			return types.includes(control.value) ? {
				typeExists: true,
			} : null;
		};
	}
}
