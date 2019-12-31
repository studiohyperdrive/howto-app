import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectsOverviewPage } from './pages/projects-overview/projects-overview.page';
import { ProjectDetailPage } from './pages/project-detail/project-detail.page';
import { TypesOverviewPage } from './pages/types-overview/types-overview.page';
import { TypeDetailPage } from './pages/type-detail/type-detail.page';
import { ProcessingPage } from './pages/processing/processing.page';
import { TypesDetailPage } from './pages/types-detail/types-detail.page';

const routes: Routes = [
  {
    path: 'projects',
    component: ProjectsOverviewPage,
  },
  {
    path: 'projects/new',
    component: ProcessingPage,
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
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        component: TypesOverviewPage,
        data: {
          title: '{project}',
        },
      },
      {
        path: 'dependency',
        component: ProcessingPage,
      },
      {
        path: ':types',
        component: TypesDetailPage,
        data: {
          title: '{project} {types}'
        },
      },
      {
        path: ':types/new',
        component: ProcessingPage
      },
      {
        path: ':types/:id',
        component: TypeDetailPage,
        data: {
          title: '{project} {id}',
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
