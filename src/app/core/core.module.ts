import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import { CoreComponents } from './components';

@NgModule({
	declarations: [
		CoreComponents,
	],
	imports: [
		MatToolbarModule,
	],
	exports: [
		CoreComponents,
	]
})
export class CoreModule { }
