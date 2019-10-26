import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppConfig } from './environments/environment';

if (AppConfig.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    preserveWhitespaces: false
  })
  // .then(() => {
  //   if ((window as any).requirejs) {
  //     (window as any).require = (path) => {
  //       if (Array.isArray(path)) {
  //         return (window as any).requirejs(path);
  //       }

  //       return (window as any).require(path);
  //     };

  //     (window as any).require.config = (window as any).requirejs.config;
  //   }
  // })
  .catch(err => console.error(err));
