import { Component, Input } from '@angular/core';

import { Project } from '../../types/project';

@Component({
	selector: 'howto-project-card',
	templateUrl: './project-card.component.html',
	styleUrls: [ './project-card.component.css' ],
})
export class ProjectCardComponent {
	@Input() public project: Project;
}
