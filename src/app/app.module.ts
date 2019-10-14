import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { RoutingModule } from './routing/routing.module';
import { CoreModule } from './core/core.module';
import { BuilderModule } from './builder/builder.module';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		RoutingModule,
		CoreModule,
		BuilderModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
