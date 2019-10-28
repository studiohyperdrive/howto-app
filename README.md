# Howto App

## Specifications
This project has been generated using:
- `@angular/cli`: 8.2.12
- `@angular`: 8.3.6
- `electron`: 7.0.0
- `nodejs`: 10.16.3
- `npm`: 6.9.0

## Project setup
### npm scripts
This project has the following npm scripts.

| Command           | Description
| ----------------- | -----------
| start             | Runs the dev build in Electron. (runs on http://localhost:4379)
| build             | Runs an Angular and Electron build.
| build:dev         | Runs an Angular and Electron with the dev configuration.
| build:prod        | Runs an Angular and Electron with the prod configuration.
| electron:linux    | Build the application for Linux.
| electron:windows  | Build the application for Windows.
| electron:mac      | Build the application for Mac.
| test              | Run the tests.
| e2s               | Run the end-to-end tests.
| version           | Update the version and changelog following conventional commits rules.
| lint              | Run the linter.

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
* [Tom Opdebeeck - Studio Hyperdrive](tom.opdebeeck@studiohyperdrive.be)
    * **Function**: JavaScript developer
    * **Period**: September 2019 -> ...
* [Denis Valcke - Studio Hyperdrive](denis.valcke@studiohyperdrive.be)
    * **Function**: JavaScript developer
    * **Period**: September 2019 -> ...

## Attributions
Icon made by [Freepik](www.flaticon.com).
Loaders made by [Sam Herbert](http://samherbert.net/svg-loaders/).
Setup based on [Maxime Gris's Angular-electron bootstrap](https://github.com/maximegris/angular-electron).
