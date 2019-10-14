import { Injectable } from '@angular/core';

import { ShellService } from '../../shared/services/shell.service';

@Injectable()
export class BuilderService {
  constructor(
    private shell: ShellService,
  ) { }

  public setupProject(name: string): Promise<void> {
    // const { pcs } = this.shell.exec('ng', 'g', '@studiohyperdrive/howto-schematics:styleguide');

    // return pcs;

    return Promise.resolve();
  }
}
