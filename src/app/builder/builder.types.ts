export enum BuilderStatus {
	MKDIR_FAILED = 'MKDIR_FAILED',
	PROJECT_DOES_NOT_EXIST = 'PROJECT_DOES_NOT_EXIST',
	INIT_APP = 'INIT_APP',
	INIT_COMPONENT = 'INIT_COMPONENT',
	INIT_STYLEGUIDE = 'INIT_STYLEGUIDE',
	INSTALLING_PACKAGES = 'INSTALLING_PACKAGES',
	INSTALLING_SCHEMATICS = 'INSTALLING_SCHEMATICS',
	BUILD_UI = 'BUILD_UI',
	RUN_STYLEGUIDE = 'RUN_STYLEGUIDE',
	WATCH_UI = 'WATCH_UI',
	DONE = 'DONE',
}

export enum BuilderType {
	atom = 'atom',
	molecule = 'molecule',
	organism = 'organism',
	page = 'page',
}

export enum BuilderProcess {
	type = 'type',
	project = 'project'
}
