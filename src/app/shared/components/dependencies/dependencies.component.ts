import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Dependency } from '../../types/dependencies';
import { DialogInstallDependencyComponent } from '../install-dependency/install-dependency.component';

@Component({
  selector: 'howto-dependencies',
  templateUrl: './dependencies.component.html',
})
export class DependenciesComponent implements OnChanges, OnDestroy {
  @Input() public dependencies: {
    [key: string]: string;
  };

  @Output() public install: EventEmitter<Dependency> = new EventEmitter<Dependency>();

  private destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private dialog: MatDialog,
  ) {}

  public dependencyList: Array<Dependency> = [];

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dependencies && changes.dependencies.currentValue) {
      this.dependencyList = Object.keys(changes.dependencies.currentValue).reduce((acc, curr) => [
        ...acc,
        {
          name: curr,
          version: changes.dependencies.currentValue[curr],
        },
      ], []);
    }
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public openDependencyDialog(): void {
    const dialogRef = this.dialog.open(DialogInstallDependencyComponent, {
      width: '400px',
      data: {
        dependencies: this.dependencies,
      },
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe((dependencyToInstall: Dependency) => {
        if (dependencyToInstall) {
          this.install.emit(dependencyToInstall);
        }
      });
  }
}
