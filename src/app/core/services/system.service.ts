import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

import { ShellService } from '../../shared/services/shell.service';
import { SystemStatus } from '../types/system';
import { parseJSON } from '../../shared/utils/parse-json';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  constructor(
    private shell: ShellService,
  ) { }

  public verifyHost(): Observable<{ status: SystemStatus; version?: string; }> {
    const { exec$ } = this.shell.exec('npm ls -g --depth=0 --json=true');

    return exec$
      .pipe(
        first(),
        map((results: string) => parseJSON(results)),
        map(({ dependencies }: any) => {
          const cli = dependencies['@angular/cli'];

          if (!cli || !cli.version) {
            return {
              status: SystemStatus.MISSING_CLI,
            };
          }

          const majorVersion = parseInt(cli.version.split('.')[0], 10);

          if (isNaN(majorVersion) || majorVersion < 8) {
            return {
              status: SystemStatus.VERSION_MISMATCH,
              version: cli.version,
            };
          }

          return {
            status: SystemStatus.OK,
          };
        }),
      );
  }
}
