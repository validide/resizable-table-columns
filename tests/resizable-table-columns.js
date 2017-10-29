/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai/index.d.ts" />
/// <reference path="../node_modules/@types/jsdom/index.d.ts" />

import { assert } from 'chai';
import { JSDOM } from '../node_modules/jsdom/lib/api';
import ResizableConstants from '../dist/js/es6/resizable-constants';
import ResizableOptions from '../dist/js/es6/resizable-options';
import ResizableTableColumns from '../dist/js/es6/resizable-table-columns';
import UtilitiesDOM from '../dist/js/es6/utilities-dom';

describe('ResizableTableColumns', function () {
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

  describe('static.getWidth()', function () {
    it('Should be 23.12 for 23.12px', function () {
      const el = DOM.window.document.createElement('span');
      el.style.width = '23.12px';
      const w = ResizableTableColumns.getWidth(el);
      assert.equal(w, 23.12);
    });

    it('Shiuld be "UtilitiesDOM.getWidth(el)" if not set', function () {
      const el = DOM.window.document.createElement('span');
      const w1 = ResizableTableColumns.getWidth(el);
      const w2 = UtilitiesDOM.getWidth(el)
      assert.equal(w1, w2);
    });
  });

  describe('static.setWidth()', function () {
    it('Should be 0 for -1', function () {
      const el = DOM.window.document.createElement('span');
      ResizableTableColumns.setWidth(el, -1);
      assert.equal(el.style.width, '0px');
    });

    it('Should be 0 for 0', function () {
      const el = DOM.window.document.createElement('span');
      ResizableTableColumns.setWidth(el, 0);
      assert.equal(el.style.width, '0px');
    });

    it('Should be 2px for 2', function () {
      const el = DOM.window.document.createElement('span');
      ResizableTableColumns.setWidth(el, 2);
      assert.equal(el.style.width, '2.00px');
    });

    it('Should be 3.10px for 3.1', function () {
      const el = DOM.window.document.createElement('span');
      ResizableTableColumns.setWidth(el, 3.1);
      assert.equal(el.style.width, '3.10px');
    });

    it('Should be 4.25px for 4.25', function () {
      const el = DOM.window.document.createElement('span');
      ResizableTableColumns.setWidth(el, 4.25);
      assert.equal(el.style.width, '4.25px');
    });

    it('Should be 5.45px for 5.449', function () {
      const el = DOM.window.document.createElement('span');
      ResizableTableColumns.setWidth(el, 5.451);
      assert.equal(el.style.width, '5.45px');
    });

    it('Should be 5.45px for 5.450', function () {
      const el = DOM.window.document.createElement('span');
      ResizableTableColumns.setWidth(el, 5.450);
      assert.equal(el.style.width, '5.45px');
    });

    it('Should be 5.46px for 5.451', function () {
      const el = DOM.window.document.createElement('span');
      ResizableTableColumns.setWidth(el, 5.451);
      assert.equal(el.style.width, '5.45px');
    });
  });

  describe('static.getInstanceId()', function () {
    it('Incement after each call', function () {
      const id1 = ResizableTableColumns.getInstanceId();
      const id2 = ResizableTableColumns.getInstanceId();

      assert.equal(id2, id1 + 1);
    });
  });
});
