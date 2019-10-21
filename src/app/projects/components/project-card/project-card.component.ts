import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Project } from '../../types/project';

@Component({
	selector: 'howto-project-card',
	templateUrl: './project-card.component.html',
	styleUrls: [ './project-card.component.css' ],
})
export class ProjectCardComponent {
	@Input() public project: Project;
	@Output() public clicked: EventEmitter<Project> = new EventEmitter<Project>();
	@Output() public deleted: EventEmitter<Project> = new EventEmitter<Project>();
}
