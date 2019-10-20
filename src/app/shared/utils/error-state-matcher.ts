import { ErrorStateMatcher } from '@angular/material';
import { FormControl } from '@angular/forms';

export class InstantErrorMatcher implements ErrorStateMatcher {
	public isErrorState(control: FormControl | null): boolean {
		return control.dirty && control.invalid;
	}
}
