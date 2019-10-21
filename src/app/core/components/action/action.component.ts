import { Component, HostListener } from '@angular/core';

import { ContextService } from '../../../shared/services/context.service';

@Component({
	selector: 'howto-action',
	templateUrl: './action.component.html',
})
export class ActionComponent {
	public hovered = false;

	constructor(
		public context: ContextService,
	) {}

	public runAction(): void {
		this.context.runAction();
	}

	public stopAction(): void {
		this.context.stopAction();
	}

	@HostListener('mouseenter')
	public onMouseEnter(): void {
		if (this.context.action$.getValue().running) {
			this.hovered = true;
		}
	}

	@HostListener('mouseleave')
	public onMouseLeave(): void {
		this.hovered = false;
	}
}
