import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
	path: '',
	redirectTo: 'projects',
	pathMatch: 'full'
}, {
	path: 'projects',
	loadChildren: () => import('../projects/projects.module').then((module) => module.ProjectsModule),
	data: {
		title: 'Projects',
	},
}];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class RoutingModule { }
