# Howto | _howto_angular_2019_

## Specifications
This project has been generated using:
- `@angular/cli`: 9.0.0-next.6
- `@angular`: 9.0.0-next.8
- `nw`: 0.41.2-sdk
- `nodejs`: 10.16.3
- `npm`: 6.9.0

## Project setup
### npm scripts
This project has the following npm scripts.

| Command        | Description
| -------------- | -----------
| start			 | Runs the dev build in Electron. (runs on http://localhost:4379)
| build			 | Runs an Angular and Electron build.
| build:dev  | Runs an Angular and Electron with the dev configuration.
| build:prod | Runs an Angular and Electron with the prod configuration.
| electron:linux | Build the application for Linux.
| electron:windows | Build the application for Windows.
| electron:mac | Build the application for Mac.
| test       | Run the tests.
| e2s        | Run the end-to-end tests.
| version    | Update the version and changelog following conventional commits rules.
| lint       | Run the linter.

All commands are executable by running `npm run [COMMAND-NAME]`.

**To get started**, don't forget a `nvm use` to activate the node version specified in the `.nvmrc` file of this project.

## Code Contribution ##
### Branches ###
We follow these naming conventions:
* **master**: Production-ready code, tagged for a production release, latest commit for development release.
* **release/***: Snapshot of a release.
* **feature/***: For developing new features.
* **bugfix/***: For bugs that are logged during testing.
* **hotfix/***: Only for hotfixing critical bugs from the `master`-branch.

### Team ###
List the team that has worked on this project, including the duration e.g.:
* [Tom Opdebeeck - Studio Hyperdrive](https://github.com/tom-odb)
    * **Function**: JavaScript developer
    * **Period**: September 2019 -> ...
* [Denis Valcke - Studio Hyperdrive](https://github.com/DenisValcke)
    * **Function**: JavaScript developer
    * **Period**: September 2019 -> ...

## Attributions
Icon made by [Freepik](www.flaticon.com).
Loaders made by [Sam Herbert](http://samherbert.net/svg-loaders/).
Setup based on [Maxime Gris's Angular-electron bootstrap](https://github.com/maximegris/angular-electron).
