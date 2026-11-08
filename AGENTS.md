# AGENTS.md

Guidance for coding agents working in this repository.

## Attribution

- Do **not** add yourself (or any AI tool, model or agent) as an author, co-author or contributor anywhere: no `Co-Authored-By:` trailers, no "Generated with …" lines, no signatures in commit messages, pull request titles/descriptions, review comments, issues or any other messages.
- Commits and pull requests are authored by the human who runs the agent.

## Project

`@validide/resizable-table-columns` is a dependency-free browser library that makes HTML table columns resizable. It is in maintenance mode.

- `sources/ts/`: TypeScript source. `index.ts` is the public entry point.
- `sources/scss/`: stylesheet, compiled to `dist/css/resizable-table-columns.css`.
- `tests/*.ts`: unit tests (Vitest + jsdom). jsdom has no layout engine, so every size reads as 0.
- `tests/browser/*.test.ts`: tests that run in a real browser (Vitest Browser Mode + Playwright) and cover layout, real pointer input and window resize. `tests/browser/support/commands.ts` holds Node-side commands that drive the real mouse.
- `pages/`, `index.html`: demo pages. `pages/` is served via GitHub Pages and loads the committed `dist/` build.
- `dist/`: build output, **committed** (used by the demo pages).

## Tooling

The package manager is pnpm, with the version pinned in `package.json` (`packageManager`). Do not use npm or yarn to install, and do not regenerate `package-lock.json`. That file is a temporary empty placeholder.

```sh
pnpm install
pnpm dev          # Vite dev server for index.html
pnpm exec playwright install chromium   # once, for the browser tests
pnpm run check    # typecheck + Biome (CI mode) + unit and Chromium browser tests with coverage
pnpm run test:unit      # jsdom unit tests only
pnpm run test:browser   # browser tests only
BROWSER_TEST_ENGINES=chromium,firefox,webkit pnpm run test:browser   # other engines (no coverage)
pnpm run lint     # Biome with auto-fix
pnpm run build    # CSS (sass) + declarations (tsc) + bundles (vite)
```

- Run `pnpm run check` before you finish any change.
- Anything that depends on measured sizes, real input or CSS belongs in `tests/browser/`. Assert with small tolerances (fonts differ between machines) rather than exact pixel values, keep the pointer inside the viewport, and remember the library debounces pointer events (100 ms) and treats two presses within `doubleClickDelay` (500 ms) as a double-click.
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
