import { Observable } from 'rxjs';

import { RunningProcess } from './os';

export interface ExecutableAction {
	name: string;
	icon?: string;
	running?: boolean;
	exec: () => Observable<RunningProcess>;
	stop: () => void;
}
