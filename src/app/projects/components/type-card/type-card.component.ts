import { Component, Input, Output, EventEmitter } from '@angular/core';

import { UiComponent } from '../../types/project';

@Component({
	selector: 'howto-type-card',
	templateUrl: './type-card.component.html',
})
export class TypeCardComponent {
	@Input() public type: UiComponent;
	@Output() public clicked: EventEmitter<UiComponent> = new EventEmitter<UiComponent>();
}
