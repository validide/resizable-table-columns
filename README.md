# Simple JavaScript resizable table columns
Inspired by **[jquery-resizable-columns](https://github.com/dobtco/jquery-resizable-columns)**
## Status
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f963825a192e4c9a8fd148212fec5c13)](https://www.codacy.com/gh/validide/resizable-table-columns/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=validide/resizable-table-columns&amp;utm_campaign=Badge_Grade)
[![npm version](https://img.shields.io/npm/v/@validide/resizable-table-columns)](https://www.npmjs.com/package/@validide/resizable-table-columns)

## Usage

### Basic
- Add the `resizable-table-columns.css` file to the page.
- Add the `bundle/index.js` file to the page.
- Optionally add a store library
- Add the HTML table markup
- Create a new instance of the resizable table like below


``` html

  <table class="data" data-rtc-resizable-table="table.one">
      <thead>
          <tr>
              <th>No.</th><!-- THIS COLUMN WILL NOT BE RESIZABLE -->
              <th data-rtc-resizable="name">Name</th>
              <th data-rtc-resizable="country">Counrty</th>
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
//will use the default options
new ResizableTableColumns(tableElement, null);

//override the default options
new ResizableTableColumns(tableElement, {
  resizeFromBody: false,
  store: store
});

// The store needs to implement the following interface
interface IStore {
  get(id: string): any;
  set(id: string, data: any): void
}
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

  // number - The maximum number off milliseconds between to pointer down events to consider the action a 'double click'
  doubleClickDelay: 500,

  // data store provider (ex: https://github.com/marcuswestin/store.js)
  store: null,

  // null or number - The suggestion for how wide (in pixels) a cell might be in case the content is really wide.
  maxInitialWidthHint: null
}
```

## Supported Browsers
All modern browsers are supported. IE and older browsers might require polyfills for the library to work.

## Demos
*  [Demo](https://validide.github.io/resizable-table-columns/dist/samples/index.html)
*  [Bootstrap Demo](https://validide.github.io/resizable-table-columns/dist/samples/bootstrap.html)
