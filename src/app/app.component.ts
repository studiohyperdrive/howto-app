import { Component } from '@angular/core';

import { ContextService } from './shared/services/context.service';

@Component({
  selector: 'howto-root',
  templateUrl: './app.component.html',
})

export class AppComponent {
  constructor (
	public context: ContextService,
  ) {}
}
