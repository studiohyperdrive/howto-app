import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsOverviewPage } from '../projects/pages/projects-overview/projects-overview.page';

const routes: Routes = [{
	path: '',
	redirectTo: 'projects',
	pathMatch: 'full'
}, {
	path: 'projects',
	loadChildren: () => import('../projects/projects.module').then((module) => module.ProjectsModule),
}];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class RoutingModule { }
