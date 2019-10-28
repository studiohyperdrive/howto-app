import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, of, Observable } from 'rxjs';
import { takeUntil, first, finalize, switchMap } from 'rxjs/operators';
import { template } from 'lodash-es';

import { BuilderService } from '../../../builder/services/builder.service';
import { BuilderStatus, BuilderProcess, BuilderType } from '../../../builder/builder.types';
import { LoaderType } from '../../../shared/types/loader';
import { ProjectService } from '../../services/project.service';
import { ContextService } from '../../../shared/services/context.service';

@Component({
  templateUrl: './processing.page.html',
})
export class ProcessingPage implements OnInit, OnDestroy {
  public status: BuilderStatus = null;
  public takingTooLong = false;

  public statusLoader = {
    [BuilderStatus.INIT_APP]: LoaderType.BOX,
    [BuilderStatus.INIT_STYLEGUIDE]: LoaderType.BARS,
    [BuilderStatus.INIT_COMPONENT]: LoaderType.BOX,
    [BuilderStatus.INSTALLING_CLI]: LoaderType.CLOCK,
    [BuilderStatus.INSTALLING_PACKAGES]: LoaderType.CLOCK,
    [BuilderStatus.INSTALLING_SCHEMATICS]: LoaderType.CLOCK,
    [BuilderStatus.BUILD_UI]: LoaderType.SWIRL,
    [BuilderStatus.DONE]: LoaderType.DONE,
  };

  public statusMessages = {
    [BuilderStatus.PROJECT_DOES_NOT_EXIST]: 'This project does not exist!',
    [BuilderStatus.MKDIR_FAILED]: 'Could not create your project folder!',
    [BuilderStatus.INIT_APP]: 'Setting up your project...',
    [BuilderStatus.INIT_STYLEGUIDE]: 'Creating a styleguide...',
    [BuilderStatus.INIT_COMPONENT]: 'Setting up your component...',
    [BuilderStatus.INSTALLING_CLI]: 'Installing the Angular CLI...',
    [BuilderStatus.INSTALLING_PACKAGES]: 'Installing packages...',
    [BuilderStatus.INSTALLING_SCHEMATICS]: 'Installing packages...',
    [BuilderStatus.BUILD_UI]: 'Building components...',
    [BuilderStatus.DONE]: 'All done!',
  };

  private takingTooLongTimer;
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private builder: BuilderService,
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private context: ContextService,
  ) { }

  public ngOnInit(): void {
    const { process, ...params } = this.route.snapshot.queryParams;

    if (!process) {
      return;
    }

    this.context.setTitle(this.getTitle(process, params));

    this.getProcessHandler(process, params as any)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe((status: BuilderStatus) => {
        this.status = status;
        this.takingTooLong = false;

        if (this.takingTooLongTimer) {
          clearTimeout(this.takingTooLongTimer);
        }

        this.takingTooLongTimer = setTimeout(() => {
          this.takingTooLong = true;
          this.cdr.detectChanges(); // TODO: figure this zone mess out
        }, 10000);

        this.cdr.detectChanges();
      });
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    if (this.takingTooLongTimer) {
      clearTimeout(this.takingTooLongTimer);
    }
  }

  private getProcessHandler(process: BuilderProcess, {
    dependencyName,
    dependencyVersion,
    projectName,
    typeName,
    projectDescription,
    type,
  }: {
    dependencyName?: string;
    dependencyVersion?: string;
    projectName: string;
    typeName?: string;
    projectDescription?: string;
    type?: BuilderType;
  }): Observable<BuilderStatus> {
    switch (process) {
      case BuilderProcess.project:
        return this.builder.setupProject(projectName, projectDescription)
          .pipe(
            finalize(() => {
              setTimeout(() => {
                this.ngZone.run(() => {
                  this.router.navigate(['projects']);
                });
              }, 2000);
            })
          );
      case BuilderProcess.type:
        return this.builder.generateType({
          name: typeName,
          type,
          project: projectName,
          build: !this.context.action.running,
        }).pipe(
          finalize(() => {
            setTimeout(() => {
              this.projectService.getProject(projectName);

              this.projectService.project$
                .pipe(first())
                .subscribe(() => {
                  this.ngZone.run(() => {
                    this.router.navigate(['/projects', projectName, `${type}s`, typeName]);
                  });
                });
            }, 2000);
          })
        );
      case BuilderProcess.system:
        return this.builder.installCLI()
          .pipe(
            finalize(() => {
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 2000);
            }),
          );
      case BuilderProcess.dependencies:
        return this.builder.installDependency({
          project: projectName,
          name: dependencyName,
          version: dependencyVersion
        }).pipe(
          finalize(() => {
            this.projectService.getProject(projectName);

            setTimeout(() => {
              this.router.navigate(['/projects', projectName]);
            }, 2000);
          }),
        );
      default:
        return of(null)
          .pipe(
            finalize(() => {
              this.router.navigate(['/projects']);
            }),
          );
    }
  }

  private getTitle(process: BuilderProcess, params: { [key: string]: string }): string {
    switch (process) {
      case BuilderProcess.project:
        return 'Creating new project';
      case BuilderProcess.type:
        return template('Creating new <%= type %>')(params);
      case BuilderProcess.system:
        return 'Angular CLI setup';
      case BuilderProcess.dependencies:
        return 'Installing dependencies';
      default:
        return 'Processing';
    }
  }
}
