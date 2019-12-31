import { DependenciesComponent } from './dependencies/dependencies.component';
import { DialogInstallDependencyComponent } from './install-dependency/install-dependency.component';
import { LoaderComponent } from './loader/loader.component';

export const SharedComponents = [
  DependenciesComponent,
  DialogInstallDependencyComponent,
  LoaderComponent,
];

export const SharedEntryComponents = [
  DialogInstallDependencyComponent,
];
