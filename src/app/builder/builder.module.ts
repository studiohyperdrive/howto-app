import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { BuilderService } from './services/builder.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    BuilderService,
  ],
})
export class BuilderModule {}
