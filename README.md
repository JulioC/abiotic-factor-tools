# Abiotic Factor Tools

This [monorepo](https://nx.dev/) implements tools to process [Abiotic Factor](https://store.steampowered.com/app/427410/Abiotic_Factor/) game files, mostly used to manage the [Abiotic Factor Wiki](https://abioticfactor.wiki.gg/)

## Requirements

Versions below are known to be working, but other versions might be compatible.

- Python 3.10.12
- pipx 1.0.0
- Poetry 1.8.3
- Node 21.7.3
- pnpm 8.7.0

## Usage

- Install project using `pnpm i`
- Create your `.env` following the `.env.example` file
- Build projects using `npx nx run-many -t build --all`

### Extracting content from the game

Use FModel to extract content from the game. In a single root folder, extract Blueprints and StringTables as JSON, and Textures as PNG.

### Exporting JSON files from extracted ones

Run `npx nx run data-exporter:serve`. This process is can be stopped once the files are exported

### Update th wiki

Run `npx nx run wiki-updater:run`. Follow the credential instructions from [mwcleric](https://pypi.org/project/mwcleric/).

## Development

This repository is a [Nx monorepo](https://nx.dev/getting-started/intro). Read their documentation and use the [Nx Console vscode extension](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console) to have a better experience.

Individual projects are found in the `/projects` folder, being described in the following sections.

### data-exporter

This Node application read raw game files to output parsed JSON and images. The RAW game files should be extracted using FModel.

### wiki-updater

This Python application pushes updates to the Wiki, using the parsed JSON files from data-exporter.
