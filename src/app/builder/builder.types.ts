export enum BuilderStatus {
	MKDIR_FAILED,
	PROJECT_DOES_NOT_EXIST,
	INIT_APP,
	INIT_COMPONENT,
	INIT_STYLEGUIDE,
	INSTALLING_PACKAGES,
	INSTALLING_SCHEMATICS,
	BUILD_UI,
	DONE,
}

export enum BuilderType {
	atom = 'atom',
	molecule = 'molecule',
	organism = 'organism',
	page = 'page',
}
