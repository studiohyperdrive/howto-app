import { Component, Input } from '@angular/core';

import { UiComponent } from '../../types/project';

@Component({
  selector: 'howto-type-card',
  templateUrl: './type-card.component.html',
})
export class TypeCardComponent {
  @Input() public type: UiComponent;
}
