import { Observable } from 'rxjs';

import { RunningProcess } from './os';

export interface ExecutableAction {
	name: string;
	icon?: string;
	pid?: number;
	exec: () => Observable<RunningProcess>;
}
