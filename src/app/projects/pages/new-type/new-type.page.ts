import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BuilderService } from '../../../builder/services/builder.service';
import { BuilderStatus } from '../../../builder/builder.types';
import { LoaderType } from '../../../shared/types/loader';

@Component({
	templateUrl: './new-type.page.html',
})
export class NewTypePage implements OnInit, OnDestroy {
	public status: BuilderStatus = null;

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

	private destroyed$: Subject<boolean> = new Subject<boolean>();

	constructor(
		private builder: BuilderService,
		private router: Router,
		private route: ActivatedRoute,
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
		})
			.pipe(
				takeUntil(this.destroyed$),
			)
			.subscribe((status: BuilderStatus) => {
				this.status = status;

				if (status === BuilderStatus.DONE) {
					setTimeout(() => {
						this.router.navigate(['/projects', project]);
					}, 2000);
				}
			});
	}

	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
