import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import slugify from 'slugify';

import { InstantErrorMatcher } from '../../../shared/utils/error-state-matcher';

@Component({
  selector: 'howto-dialog-new-type',
  templateUrl: './new-type.component.html',
  styleUrls: [
    './new-type.component.scss',
  ],
})
export class DialogNewTypeComponent implements OnInit, OnDestroy {
  public newTypeForm: FormGroup;
  public errorStateMatcher = new InstantErrorMatcher();
  public slugified = '';

  private destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogNewTypeComponent>,
  ) { }

  public ngOnInit(): void {
    this.newTypeForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        this.typeDoesNotExist(),
      ]),
    });

    this.newTypeForm.get('name').valueChanges
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
    this.dialogRef.close(slugify(this.newTypeForm.value.name));
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
