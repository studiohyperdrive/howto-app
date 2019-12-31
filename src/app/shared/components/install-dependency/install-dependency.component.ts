import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MatAutocompleteSelectedEvent } from '@angular/material';

import { Dependency } from '../../types/dependencies';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, tap, mergeMap } from 'rxjs/operators';
import { DependenciesService } from '../../services/dependencies.service';

@Component({
  selector: 'howto-install-dependency',
  templateUrl: './install-dependency.component.html',
})
export class DialogInstallDependencyComponent implements OnInit, OnDestroy {
  public query = new FormControl(null);

  public dependencyToInstall: Dependency = null;
  public results: Dependency[] = [];
  public searching = false;

  private destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public dialogRef: MatDialogRef<DialogInstallDependencyComponent>,
    private dependenciesService: DependenciesService,
  ) { }

  public ngOnInit(): void {
    this.query.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        tap(() => {
          this.dependencyToInstall = null;
          this.results = [];
        }),
        debounceTime(500),
        tap(() => {
          this.searching = true;
        }),
        mergeMap((query: string) => this.dependenciesService.search(query))
      )
      .subscribe((dependencies: Dependency[]) => {
        this.results = dependencies;
        this.searching = false;
      }, () => {
        this.searching = false;
      });
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public displayFn(dep: Dependency): string {
    return dep ? `${dep.name}@${dep.version}` : null;
  }

  public handleOptionSelected({ option }: MatAutocompleteSelectedEvent): void {
    this.dependencyToInstall = option.value;
  }

  public onSubmit(): void {
    this.dialogRef.close(this.dependencyToInstall);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
