import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectsOverviewPage } from './pages/projects-overview/projects-overview.page';
import { NewProjectPage } from './pages/new-project/new-project.page';

const routes: Routes = [
	{
		path: '',
		component: ProjectsOverviewPage,
	},
	{
		path: 'new',
		component: NewProjectPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ProjectsRoutingModule { }
