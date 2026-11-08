# Simple JavaScript resizable table columns

Inspired by **[jquery-resizable-columns](https://github.com/dobtco/jquery-resizable-columns)**
## Status

At the moment the project is in "maintenance mode". I will not be investing any more time into developing new features or fixing any bugs.


[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f963825a192e4c9a8fd148212fec5c13)](https://www.codacy.com/gh/validide/resizable-table-columns/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=validide/resizable-table-columns&amp;utm_campaign=Badge_Grade)
[![npm version](https://img.shields.io/npm/v/@validide/resizable-table-columns)](https://www.npmjs.com/package/@validide/resizable-table-columns)

## Usage

### Install

```sh
npm install @validide/resizable-table-columns
```

```js
import { ResizableTableColumns } from "@validide/resizable-table-columns";
import "@validide/resizable-table-columns/css"; // dist/css/resizable-table-columns.css
```

Without a bundler, load the ES module directly:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@validide/resizable-table-columns/dist/css/resizable-table-columns.css">
<script type="module">
  import { ResizableTableColumns } from "https://cdn.jsdelivr.net/npm/@validide/resizable-table-columns/dist/bundle/index.js";
</script>
```
A UMD build (`dist/bundle/index.umd.cjs`) exposing the `validide_resizableTableColumns` global is also available.

### Basic

- Add the `resizable-table-columns.css` file to the page.
- Import the library (see above).
- Optionally add a store library.
- Add the HTML table markup.
- Create a new instance of the resizable table like below.


```html

  <table class="data" data-rtc-resizable-table="table.one">
      <thead>
          <tr>
              <th>No.</th><!-- THIS COLUMN WILL NOT BE RESIZABLE -->
              <th data-rtc-resizable="name">Name</th>
              <th data-rtc-resizable="country">Country</th>
              <th data-rtc-resizable="region">Region</th>
              <th>City</th><!-- THIS COLUMN WILL NOT BE RESIZABLE -->
              <th data-rtc-resizable="street">Street</th>
              <th data-rtc-resizable="post-code">Post Code</th>
              <th data-rtc-resizable="last-update">Last updated</th>
              <th data-rtc-resizable="uuid">UUID</th>
          </tr>
      </thead>
      <tbody>
          <tr>
              <td>1</td>
              <td>Eugenia</td>
              <td>Serbia</td>
              <td>MN</td>
              <td>Minneapolis</td>
              <td>Ap #207-8285 Nibh Rd.</td>
              <td>41754</td>
              <td>2017-11-15T16:52:00-08:00</td>
              <td>E212DAC2-220E-9589-D96A-3B58242E9817</td>
          </tr>
      </tbody>
  </table>

```

```js
// will use the default options
new ResizableTableColumns(tableElement);

// override the default options
new ResizableTableColumns(tableElement, {
  resizeFromBody: false,
  store: store
});

// The store needs to implement the following interface
interface IStore {
  get(id: string): unknown;
  set(id: string, data: unknown): void;
}
```

### Events

The table element dispatches `eventResizeStart.rtc`, `eventResize.rtc` and `eventResizeStop.rtc` custom events.
Their `detail` is a `ResizableEventDetail`: `{ column, columnWidth, table, tableWidth }`.

```js
table.addEventListener("eventResizeStop.rtc", (e) => console.log(e.detail.columnWidth));
```

### Default configuration options

```js
var options = {
  // boolean - The resize handle will span the entire height of the table
  resizeFromBody: true,

  // null or number - The minimum width any column in the table should have
  minWidth: 40,

  // null or number - The maximum width any column in the table should have
  maxWidth: null,

  // number - The maximum number of milliseconds between two pointer down events to consider the action a 'double click'
  doubleClickDelay: 500,

  // data store provider (ex: https://github.com/marcuswestin/store.js)
  store: null,

  // null or number - The suggestion for how wide (in pixels) a cell might be in case the content is really wide.
  maxInitialWidthHint: null,
};
```

## Development

This project uses [pnpm](https://pnpm.io); the exact version is pinned in `package.json` (`packageManager`).

```sh
corepack enable   # once, makes the pinned pnpm version available
pnpm install
pnpm exec playwright install chromium   # browser for the browser-mode tests
pnpm dev          # demo page with live reload
pnpm run check    # typecheck, lint and test
pnpm run build
```

## Supported Browsers

All modern (evergreen) browsers are supported. Dragging uses [Pointer Events](https://developer.mozilla.org/docs/Web/API/Pointer_events), so mouse, touch and pen input all work. Internet Explorer is not supported.

## Upgrading

- Errors thrown on invalid input or markup are now `Error` instances (previously plain strings). The messages are unchanged; read them with `error.message`.
- `ResizableConstants.events.pointerDown` / `pointerMove` / `pointerUp` are now `["pointerdown"]`, `["pointermove"]` and `["pointerup", "pointercancel"]` (previously separate mouse and touch events).

## Demos

-  [Demo](https://validide.github.io/resizable-table-columns/pages/index.html)
-  [Bootstrap Demo](https://validide.github.io/resizable-table-columns/pages/bootstrap.html)
