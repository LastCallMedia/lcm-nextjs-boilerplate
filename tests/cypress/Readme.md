<h1 align="center">Welcome to Cypress to Playwright 👋</h1>

> Automatic migration from cypress to playwright

Link to tool: https://github.com/11joselu/cypress-to-playwright

## Prerequisites

- node >=16.0.0

## Install

```sh
pnpm install @11joselu/cypress-to-playwright -D
```

## Usage

```sh
cd tests/
pnpm convert:playwright
```

## How it works

1. It will read all js files found in the <cypress_directory> folder.
2. It will convert each cypress command (supported ones) to the playwright version.
3. It will write the new files in the playwright folder at the same level as the indicated folder.
4. Follow the steps indicated in the script.

> **Warning**
>
> Migration is not perfect, therefore you will have to make modifications in the new code
