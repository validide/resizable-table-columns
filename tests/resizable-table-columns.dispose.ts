/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai/index.d.ts" />
/// <reference path="../node_modules/@types/jsdom/index.d.ts" />

import { assert } from 'chai';
import { JSDOM } from 'jsdom';
import { ResizableConstants } from '../sources/ts/resizable-constants';
import { ResizableOptions } from '../sources/ts/resizable-options';
import { ResizableTableColumns } from '../sources/ts/resizable-table-columns';

describe('ResizableTableColumns', function () {
  describe('.dispose', function () {
    const DOM = new JSDOM(`<!DOCTYPE html>
    <html>
      <head></head>
      <body>
        <table id="valid-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Counrty</th>
              <th>Region</th>
              <th>City</th>
              <th>Street</th>
              <th>Post Code</th>
              <th>Last updated</th>
              <th>UUID</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>10</td>
              <td>Alexander</td>
              <td>Fiji</td>
              <td>Istanbul</td>
              <td>Istanbul</td>
              <td>P.O. Box 879, 3462 Diam. St.</td>
              <td>JS5Z 4UZ</td>
              <td>2016-10-03T23:00:32-07:00</td>
              <td>F854BE7E-C117-7B9A-F3D5-9EAD294315D0</td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>`);

    it('Should dispose the object', function () {
      const el = DOM.window.document.getElementById('valid-table');
      assert.isNotNull(el, 'Table element should be found in dom');

      const rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      rtc.dispose();

      assert.isObject(rtc);
      assert.isTrue(typeof (el as any)[ResizableConstants.dataPropertyName] === 'undefined');
    });
  });
});
