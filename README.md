# Howto | _howto_angular_2019_

## Specifications
This project has been generated using:
- `@angular/cli`: 9.0.0-next.6
- `@angular`: 9.0.0-next.8
- `nw`: 0.41.2-sdk
- `nodejs`: 10.16.3
- `npm`: 6.9.0

Based on the following boilerplate: https://github.com/nwutils/nw-angular-cli-example

## Project setup
### npm scripts
This project has the following npm scripts.

| Command        | Description
| -------------- | -----------
| ng			 | Runs `ng`
| start			 | Runs `concurrently \"npm run start:web\" \"wait-on http://localhost:8964 && nw .\"`
| start:web		 | Runs `ng serve --port=8964`
| build			 | Runs `npm run build:clean && npm run build:ng && npm run build:nw`
| build:clean 	 | Runs `rimraf ./dist-ng ./dist`
| build:ng		 | Runs `ng build --prod --output-path ./dist-ng`
| build:nw		 | Runs `nwbuild .`
| build:win		 | Runs `nwbuild  -p osx64 .`
| build:win		 | Runs `nw-build -p win64 .`
| generate		 | Runs `ng generate`
| test			 | Runs `ng test`
| lint			 | Runs `ng lint`
| e2e			 | Runs `ng e2e`

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
Icon made by Freepik from www.flaticon.com