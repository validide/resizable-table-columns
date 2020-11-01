# Simple JavaScript resizable table columns
Inspired by **[jquery-resizable-columns](https://github.com/dobtco/jquery-resizable-columns)**
## This is still a work in progress

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

**[Demo](https://validide.github.io/resizable-table-columns/dist/samples/index.html)**

**[Bootstrap Demo](https://validide.github.io/resizable-table-columns/dist/samples/bootstrap.html)**

