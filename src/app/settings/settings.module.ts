import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { SettingsPages } from './pages/index';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
	imports: [
		SettingsRoutingModule,
		SharedModule,
	],
	declarations: [
		SettingsPages,
	],
})
export class SettingsModule {}
