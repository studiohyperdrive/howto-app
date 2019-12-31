import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ShellService } from './shell.service';
import { Dependency } from '../types/dependencies';
import { parseJSON } from '../utils/parse-json';
import { BuilderStatus } from '../../builder/builder.types';

@Injectable({
  providedIn: 'root',
})
export class DependenciesService {
  constructor(
    private shell: ShellService,
  ) { }

  public search(query: string): Observable<Dependency[]> {
    const { exec$ } = this.shell.exec(`npm search ${query} --json`);

    return exec$
      .pipe(
        map(parseJSON),
        map((response: any) => (response || []).map(({ name, version }) => ({
          name,
          version,
        }))),
      );
  }

  public installDependency(cwd: string, { name, version }: Dependency): Observable<BuilderStatus> {
    const { exec$ } = this.shell.exec(`npm install ${name}@${version}`, { cwd });

    return exec$;
  }
}
