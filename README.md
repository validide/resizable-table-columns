# Simple JavaScript resizable table columns
Inspired by **[jquery-resizable-columns](https://github.com/dobtco/jquery-resizable-columns)**
## Status
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f963825a192e4c9a8fd148212fec5c13)](https://www.codacy.com/gh/validide/resizable-table-columns/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=validide/resizable-table-columns&amp;utm_campaign=Badge_Grade)
[![npm version](https://img.shields.io/npm/v/@validide/resizable-table-columns)](https://www.npmjs.com/package/@validide/resizable-table-columns)

## Usage
### Basic

```js
//will use the default options
new ResizableTableColumns(tableElement, null);

//override the default options
new ResizableTableColumns(tableElement, {
  resizeFromBody: false,
  store: store
});
```

### Default configuration options
```js
var  options = {
  // boolean - The resize handle will span the entire height of the table
  resizeFromBody: true,

  // null or number - The minimum width any column in the table should have
  minWidth: 40,

  // null or number - The maximum width any column in the table should have
  maxWidth: null,

  // boolean - Should the minimum width take into account CSS rules?
  obeyCssMinWidth: false,

  // boolean - Should the maximum width take into account CSS rules?
  obeyCssMaxWidth: false,

  // number - The maximum number off milliseconds between to pointer down events to consider the action a 'double click'
  doubleClickDelay: 500,

  // data store provider (ex: https://github.com/marcuswestin/store.js)
  store: null,

  // null or number - The suggestion for how wide (in pixels) a cell might be in case the content is really wide.
  maxInitialWidthHint: null
}
```

## Supported Browsers
IE 10 and above

## Demos
*  [Demo](https://validide.github.io/resizable-table-columns/dist/samples/index.html)
*  [Bootstrap Demo](https://validide.github.io/resizable-table-columns/dist/samples/bootstrap.html)
