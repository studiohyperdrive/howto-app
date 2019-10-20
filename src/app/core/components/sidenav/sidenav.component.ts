import { Component } from '@angular/core';
import { ContextService } from 'src/app/shared/services/context.service';

@Component({
	selector: 'howto-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: [
		'./sidenav.component.scss',
	],
})
export class SidenavComponent {
	constructor(
		private context: ContextService,
	) {}

	public onClick(): void {
		this.context.toggleSidebar(false)
	}
}
