import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsOverviewPage } from './pages/settings-overview/settings-overview.page';

const routes: Routes = [
	{
		path: 'settings',
		component: SettingsOverviewPage,
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class SettingsRoutingModule { }
