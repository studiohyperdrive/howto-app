import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { ShellService } from './services/shell.service';

@NgModule({
	providers: [
		ShellService,
	],
	imports: [
		MatCardModule,
		MatButtonModule,
	],
	exports: [
		MatCardModule,
		MatButtonModule,
	],
})
export class SharedModule { }
