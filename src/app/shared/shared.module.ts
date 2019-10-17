import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { SharedComponents } from './components/index';
import { ShellService } from './services/shell.service';

@NgModule({
	providers: [
		ShellService,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatInputModule,
		MatCardModule,
		MatButtonModule,
		MatDialogModule,
		MatFormFieldModule,
		MatProgressBarModule,
	],
	declarations: [
		SharedComponents,
	],
	exports: [
		CommonModule,
		ReactiveFormsModule,
		MatInputModule,
		MatCardModule,
		MatButtonModule,
		MatDialogModule,
		MatFormFieldModule,
		MatProgressBarModule,
		SharedComponents,
	],
})
export class SharedModule { }
