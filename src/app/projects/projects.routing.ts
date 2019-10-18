import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectsOverviewPage } from './pages/projects-overview/projects-overview.page';
import { NewProjectPage } from './pages/new-project/new-project.page';
import { ProjectDetailPage } from './pages/project-detail/project-detail.page';
import { TypesOverviewPage } from './pages/types-overview/types-overview.page';

const routes: Routes = [
	{
		path: '',
		component: ProjectsOverviewPage,
	},
	{
		path: 'new',
		component: NewProjectPage,
		data: {
			title: 'Create New Project',
		},
	},
	{
		path: ':project',
		component: ProjectDetailPage,
		children: [
			{
				path: '',
				component: TypesOverviewPage,
				data: {
					title: '{project}',
				},
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ProjectsRoutingModule { }
