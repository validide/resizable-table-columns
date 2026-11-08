# AGENTS.md

Guidance for coding agents working in this repository.

## Attribution

- Do **not** add yourself (or any AI tool, model or agent) as an author, co-author or contributor anywhere: no `Co-Authored-By:` trailers, no "Generated with …" lines, no signatures in commit messages, pull request titles/descriptions, review comments, issues or any other messages.
- Commits and pull requests are authored by the human who runs the agent.

## Project

`@validide/resizable-table-columns` is a dependency-free browser library that makes HTML table columns resizable. It is in maintenance mode.

- `sources/ts/`: TypeScript source. `index.ts` is the public entry point.
- `sources/scss/`: stylesheet, compiled to `dist/css/resizable-table-columns.css`.
- `tests/`: Vitest tests (jsdom).
- `pages/`, `index.html`: demo pages. `pages/` is served via GitHub Pages and loads the committed `dist/` build.
- `dist/`: build output, **committed** (used by the demo pages).

## Tooling

The package manager is pnpm, with the version pinned in `package.json` (`packageManager`). Do not use npm or yarn to install, and do not regenerate `package-lock.json`. That file is a temporary empty placeholder.

```sh
pnpm install
pnpm dev          # Vite dev server for index.html
pnpm run check    # typecheck + Biome (CI mode) + tests with coverage
pnpm run lint     # Biome with auto-fix
pnpm run build    # CSS (sass) + declarations (tsc) + bundles (vite)
```

- Run `pnpm run check` before you finish any change.
- Run `pnpm run build` when you change sources or styles, so that `dist/` stays in sync.
- Formatting and linting are done by Biome (`biome.json`). Don't add Prettier or ESLint.
- pnpm settings (exact versions, 7-day minimum release age, allowed build scripts) live in `pnpm-workspace.yaml`. Respect the release-age rule when you pick dependency versions.

## Public API

Keep the public API surface backward compatible unless the maintainer explicitly asks for a breaking change. It consists of:

- everything exported from `sources/ts/index.ts`, including every public and static member of the exported classes
- the package entry paths in `package.json` (`main`, `module`, `types`, `exports`)
- the UMD global `validide_resizableTableColumns`
- the CSS file path and class names
- the `data-rtc-*` attributes
- the `*.rtc` event names

`tests/public-api.ts` guards this surface. If you make an intentional, approved change, update that test and the README's "Upgrading" section.
