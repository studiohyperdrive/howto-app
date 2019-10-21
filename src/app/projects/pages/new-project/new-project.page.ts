import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BuilderService } from '../../../builder/services/builder.service';
import { BuilderStatus } from '../../../builder/builder.types';
import { LoaderType } from '../../../shared/types/loader';

@Component({
	templateUrl: './new-project.page.html',
})
export class NewProjectPage implements OnInit, OnDestroy {
	public status: BuilderStatus = null;

	public statusLoader = {
		[BuilderStatus.INIT_APP]: LoaderType.BOX,
		[BuilderStatus.INIT_STYLEGUIDE]: LoaderType.BARS,
		[BuilderStatus.INSTALLING_PACKAGES]: LoaderType.CLOCK,
		[BuilderStatus.INSTALLING_SCHEMATICS]: LoaderType.CLOCK,
		[BuilderStatus.BUILD_UI]: LoaderType.SWIRL,
		[BuilderStatus.DONE]: LoaderType.DONE,
	};

	public statusMessages = {
		[BuilderStatus.MKDIR_FAILED]: 'Could not create your project folder!',
		[BuilderStatus.INIT_APP]: 'Setting up your project...',
		[BuilderStatus.INIT_STYLEGUIDE]: 'Creating a styleguide...',
		[BuilderStatus.INSTALLING_PACKAGES]: 'Installing packages...',
		[BuilderStatus.INSTALLING_SCHEMATICS]: 'Installing packages...',
		[BuilderStatus.BUILD_UI]: 'Building components...',
		[BuilderStatus.DONE]: 'All done!',
	};

	private destroyed$: Subject<boolean> = new Subject<boolean>();

	constructor(
		private builder: BuilderService,
		private router: Router,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
		private ngZone: NgZone,
	) {}

	public ngOnInit(): void {
		const { projectName, projectDescription } = this.route.snapshot.queryParams;

		if (!projectName) {
			return;
		}

		this.builder.setupProject(projectName, projectDescription)
			.pipe(
				takeUntil(this.destroyed$),
			)
			.subscribe((status: BuilderStatus) => {
				this.status = status;

				this.cdr.detectChanges(); // TODO: figure this zone mess out

				if (status === BuilderStatus.DONE) {
					setTimeout(() => {
						this.ngZone.run(() => {
							this.router.navigate(['projects']);
						});
					}, 2000);
				}
			});
	}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
