import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectsOverviewPage } from './pages/projects-overview/projects-overview.page';
import { NewProjectPage } from './pages/new-project/new-project.page';
import { ProjectDetailPage } from './pages/project-detail/project-detail.page';
import { TypesOverviewPage } from './pages/types-overview/types-overview.page';
import { NewTypePage } from './pages/new-type/new-type.page';
import { TypeDetailPage } from './pages/type-detail/type-detail.page';

const routes: Routes = [
	{
		path: 'projects',
		component: ProjectsOverviewPage,
	},
	{
		path: 'projects/new',
		component: NewProjectPage,
		data: {
			title: 'Creating New Project',
		},
	},
	{
		path: 'projects/:project',
		component: ProjectDetailPage,
		children: [
			{
				path: '',
				component: TypesOverviewPage,
				data: {
					title: '{project}',
				},
			},
			{
				path: ':type/new',
				component: NewTypePage,
				data: {
					title: 'Creating New {type}',
				},
			},
			{
				path: ':type/:id',
				component: TypeDetailPage,
				data: {
					title: '{project} {type}',
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
