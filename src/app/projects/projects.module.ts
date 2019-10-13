import { NgModule } from '@angular/core';
import { ProjectsPages } from './pages';
import { ProjectsComponents } from './components';
import { ProjectsRoutingModule } from './projects.routing';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [
		ProjectsPages,
		ProjectsComponents,
	],
	imports: [
		ProjectsRoutingModule,
		SharedModule,
	]
})
export class ProjectsModule { }
