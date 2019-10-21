import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import slugify from 'slugify';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { InstantErrorMatcher } from '../../../shared/utils/error-state-matcher';

@Component({
	selector: 'howto-dialog-new-project',
	templateUrl: './new-project.component.html',
	styleUrls: [
		'./new-project.component.scss',
	],
})
export class DialogNewProjectComponent implements OnInit, OnDestroy {
	public errorStateMatcher = new InstantErrorMatcher();
	public newProjectForm: FormGroup;
	public slugified = '';

	private destroyed$: Subject<boolean> = new Subject<boolean>();

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

		this.newProjectForm.get('name').valueChanges
			.pipe(
				takeUntil(this.destroyed$),
			)
			.subscribe((name: string) => {
				this.slugified = slugify(name);
			});
	}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	public onCancel(): void {
		this.dialogRef.close();
	}

	public handleFormSubmit(): void {
		this.dialogRef.close(slugify(this.newProjectForm.value.name));
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
