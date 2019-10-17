import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { ProjectsComponents, ProjectsEntryComponents } from './components';
import { ProjectsPages } from './pages';
import { ProjectsRoutingModule } from './projects.routing';

@NgModule({
	declarations: [
		ProjectsPages,
		ProjectsComponents,
	],
	imports: [
		ProjectsRoutingModule,
		SharedModule,
	],
	entryComponents: [
		ProjectsEntryComponents,
	],
})
export class ProjectsModule { }
