import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';

import { BuilderService } from '../../../builder/services/builder.service';
import { BuilderStatus } from '../../../builder/builder.types';
import { LoaderType } from '../../../shared/types/loader';
import { ProjectService } from '../../services/project.service';
import { ContextService } from 'src/app/shared/services/context.service';

@Component({
	templateUrl: './new-type.page.html',
})
export class NewTypePage implements OnInit, OnDestroy {
	public status: BuilderStatus = null;
	public takingTooLong = false;

	public statusLoader = {
		[BuilderStatus.INIT_COMPONENT]: LoaderType.BOX,
		[BuilderStatus.BUILD_UI]: LoaderType.SWIRL,
		[BuilderStatus.DONE]: LoaderType.DONE,
	};

	public statusMessages = {
		[BuilderStatus.PROJECT_DOES_NOT_EXIST]: 'This project does not exist!',
		[BuilderStatus.INIT_COMPONENT]: 'Setting up your component...',
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
	) {}

	public ngOnInit(): void {
		const { name, project } = this.route.snapshot.queryParams;
		const type = this.route.snapshot.params.type;

		if (!name || !type || !project) {
			return;
		}

		this.builder.generateType({
			name,
			type,
			project,
			build: !this.context.action.running,
		})
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

				if (status === BuilderStatus.DONE) {
					this.projectService.getProject(project);

					this.projectService.project$
						.pipe(first())
						.subscribe(() => {
							this.ngZone.run(() => {
								this.router.navigate(['/projects', project]);
							});
						});
				}
			});
	}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
		if (this.takingTooLongTimer) {
			clearTimeout(this.takingTooLongTimer);
		}
	}
}
