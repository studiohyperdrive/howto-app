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
    const os = this.document.defaultView.require('os');
    const path = this.document.defaultView.require('path');

    this.location = new FormControl(path.join(os.homedir(), 'Projects'));
  }
}
