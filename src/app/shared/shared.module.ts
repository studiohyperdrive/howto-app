import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatInputModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MonacoEditorModule } from 'ngx-monaco-editor';

import { SharedComponents } from './components/index';
import { ShellService } from './services/shell.service';

@NgModule({
	providers: [
		ShellService,
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,

		MatInputModule,
		MatButtonModule,
		MatCardModule,
		MatDialogModule,
		MatDividerModule,
		MatFormFieldModule,
		MatIconModule,
		MatListModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatTabsModule,
		MonacoEditorModule.forRoot(),
	],
	declarations: [
		SharedComponents,
	],
	exports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,

		MatInputModule,
		MatButtonModule,
		MatCardModule,
		MatDialogModule,
		MatDividerModule,
		MatFormFieldModule,
		MatIconModule,
		MatListModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatTabsModule,
		MonacoEditorModule,

		SharedComponents,
	],
})
export class SharedModule { }
