import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProcessingPage } from './projects/pages/processing/processing.page';

const routes: Routes = [{
  path: '',
  redirectTo: 'projects',
  pathMatch: 'full'
}, {
  path: 'system',
  component: ProcessingPage,
}, {
  path: '**',
  redirectTo: '/projects',
  pathMatch: 'full',
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
