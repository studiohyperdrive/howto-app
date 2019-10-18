import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

import { CoreComponents } from './components';

@NgModule({
	declarations: [
		CoreComponents,
	],
	imports: [
		CommonModule,
		MatToolbarModule,
	],
	exports: [
		CoreComponents,
	]
})
export class CoreModule { }
