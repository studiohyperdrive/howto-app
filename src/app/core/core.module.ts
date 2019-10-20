import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import { SharedModule } from '../shared/shared.module';

import { CoreComponents } from './components';

@NgModule({
	declarations: [
		CoreComponents,
	],
	imports: [
		SharedModule,
		MatToolbarModule,
	],
	exports: [
		CoreComponents,
	]
})
export class CoreModule { }
