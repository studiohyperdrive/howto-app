import { Component, Input } from '@angular/core';
import { LoaderType } from '../../types/loader';

@Component({
	selector: 'howto-loader',
	templateUrl: './loader.component.html',
	styleUrls: [
		'./loader.component.scss',
	],
})
export class LoaderComponent {
	@Input() public type: LoaderType = LoaderType.DOTS;

	public LoaderType = LoaderType;
}
