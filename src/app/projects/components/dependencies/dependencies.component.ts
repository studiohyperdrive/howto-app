import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
	selector: 'howto-dependencies',
	templateUrl: './dependencies.component.html',
})
export class DependenciesComponent implements OnChanges {
	@Input() public dependencies: {
		[key: string]: string;
	};

	public dependencyList: Array<{
		name: string;
		version: string;
	}> = [];

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
}
