import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
	templateUrl: './settings-overview.page.html',
})
export class SettingsOverviewPage {
	public location: FormControl;

	constructor(
		@Inject(DOCUMENT) private document,
	) {
		const os = this.document.defaultView.nw.require('os');
		const path = this.document.defaultView.nw.require('path');

		this.location = new FormControl(path.join(os.homedir(), 'Projects'));
	}
}
