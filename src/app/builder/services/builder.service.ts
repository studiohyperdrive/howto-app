import { Injectable, Inject, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, of, throwError, concat, merge } from 'rxjs';
import { filter, first } from 'rxjs/operators';

import { FileService } from '../../shared/services/file.service';
import { ShellService } from '../../shared/services/shell.service';
import { BuilderStatus, BuilderType } from '../builder.types';
import { Dependency } from '../../shared/types/dependencies';
import { DependenciesService } from '../../shared/services/dependencies.service';

@Injectable()
export class BuilderService {
  private path;
  private require;
  private root;

  constructor(
    @Inject(DOCUMENT) private doc,
    private shell: ShellService,
    private fs: FileService,
    private dependencies: DependenciesService,
    private ngZone: NgZone,
  ) {
    this.path = this.doc.defaultView.require('path');
    this.require = this.doc.defaultView.require;
    this.root = this.path.join(this.require('os').homedir(), 'Projects');
  }

  public installCLI(): Observable<BuilderStatus> {
    return concat(
      this.run({
        cmd: 'npm install -g @angular/cli@8.* --silent',
        status: BuilderStatus.INSTALLING_CLI,
      }),
      of(BuilderStatus.DONE),
    );
  }

  public setupProject(name: string, description: string): Observable<BuilderStatus> {
    if (!this.fs.makeDir(this.root)) {
      return throwError(BuilderStatus.MKDIR_FAILED);
    }

    const generateApp = this.run({
      cmd: `ng new ${name} --routing true --style scss --skipInstall true --defaults true`,
      status: BuilderStatus.INIT_APP,
    });
    const updateDescription = this.updateProjectDescription(name, description);
    const installSchematics = this.run({
      cmd: 'npm install --save-dev @studiohyperdrive/howto-schematics@1.0.0 --silent',
      status: BuilderStatus.INSTALLING_SCHEMATICS,
      project: name,
    });
    const generateStyleguide = this.run({
      cmd: `ng g @studiohyperdrive/howto-schematics:styleguide --skipInstall`,
      status: BuilderStatus.INIT_STYLEGUIDE,
      project: name,
    });
    const installDependencies = this.run({
      cmd: 'npm install --silent',
      status: BuilderStatus.INSTALLING_PACKAGES,
      project: name,
    });
    const buildUI = this.run({
      cmd: `ng build ui`,
      status: BuilderStatus.BUILD_UI,
      project: name,
    });

    return concat(
      generateApp,
      updateDescription,
      installSchematics,
      generateStyleguide,
      installDependencies,
      buildUI,
      of(BuilderStatus.DONE),
    );
  }

  public atom(project: string, name: string): Observable<any> {
    return this.generateType({
      name,
      project,
      type: BuilderType.atom,
    });
  }

  public molecule(project: string, name: string): Observable<any> {
    return this.generateType({
      name,
      project,
      type: BuilderType.molecule,
    });
  }

  public organism(project: string, name: string): Observable<any> {
    return this.generateType({
      name,
      project,
      type: BuilderType.organism,
    });
  }

  public page(project: string, name: string): Observable<any> {
    return this.generateType({
      name,
      project,
      type: BuilderType.page,
    });
  }

  public generateType({
    name,
    type,
    project,
    build = true,
  }: {
    name: string;
    type: BuilderType;
    project: string;
    build?: boolean;
  }): Observable<BuilderStatus> {
    if (!this.fs.pathExists(name)) {
      throwError(BuilderStatus.PROJECT_DOES_NOT_EXIST);
    }

    const generateType = this.run({
      cmd: `ng g @studiohyperdrive/howto-schematics:${type} ${name}`,
      status: BuilderStatus.INIT_COMPONENT,
      project,
    });
    const buildUI = build ? this.run({
      cmd: `ng build ui`,
      status: BuilderStatus.BUILD_UI,
      project,
    }) : of(null);

    return concat(
      generateType,
      buildUI,
      of(BuilderStatus.DONE),
    );
  }

  public installDependency({ project, name, version }: Dependency & { project: string }): Observable<BuilderStatus> {
    const cwd = this.path.join(this.root, project);

    return concat(
      merge(of(BuilderStatus.INSTALLING_PACKAGES), this.dependencies.installDependency(cwd, { name, version })),
      of(BuilderStatus.DONE),
    );
  }

  private run({ cmd, status, project }: { cmd: string; status: BuilderStatus; project?: string; }): Observable<BuilderStatus> {
    return this.ngZone.run(() => {
      const { exec$ } = this.shell.run<BuilderStatus>({
        cmd,
        status: status.toString(),
        cwd: project,
      });

      return exec$.pipe(
        filter((message: any) => !!BuilderStatus[message]),
      );
    });
  }

  private updateProjectDescription(project: string, description: string): Observable<any> {
    return new Observable((subscriber) => {
      const packageJsonLocation = this.path.join(this.root, project, 'package.json');

      if (!this.fs.pathExists(packageJsonLocation)) {
        subscriber.error(`Could not find package.json in "${packageJsonLocation}"!`);
        subscriber.complete();

        return;
      }

      const packageJson = this.fs.readFile(packageJsonLocation, { json: true });

      this.fs.writeFile(packageJsonLocation, {
        ...packageJson,
        description,
      }, { json: true })
        .pipe(
          first(),
        )
        .subscribe(
          (result) => {
            subscriber.next(result);
            subscriber.complete();
          },
          (err) => {
            subscriber.error(err);
            subscriber.complete();
          }
        );
    });
  }
}
