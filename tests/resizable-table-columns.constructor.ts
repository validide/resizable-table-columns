/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai/index.d.ts" />
/// <reference path="../node_modules/@types/jsdom/index.d.ts" />

import { assert } from 'chai';
import { JSDOM } from 'jsdom';
import { ResizableConstants } from '../sources/ts/resizable-constants';
import { ResizableOptions } from '../sources/ts/resizable-options';
import { ResizableTableColumns } from '../sources/ts/resizable-table-columns';

describe('ResizableTableColumns', function () {
  describe('constructor', function () {
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
        <table id="missing-head-and-body">
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
        </table>
        <table id="missing-head-and-body-2">
        </table>
        <table id="missing-body">
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
        </table>
        <table id="missing-head">
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
        <table id="double-head">
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
        <table id="double-body">
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
        <table id="invalid-header">
          <thead>
            <tr>
              <th></th>
              <td></td>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <table id="invalid-header2">
          <thead>
            <tr>
              <td></td>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <table id="invalid-header3">
          <thead>
            <tr></tr>
          </thead>
          <tbody></tbody>
        </table>
        <table id="invalid-header4">
          <thead></thead>
          <tbody></tbody>
        </table>
      </body>
    </html>`);

    it('Should construct the object', function () {
      const el = DOM.window.document.getElementById('valid-table');
      assert.isNotNull(el, 'Table element should be found in dom');

      const rtc = new ResizableTableColumns(el as HTMLTableElement, null);

      assert.isObject(rtc);
      assert.isObject((el as any)[ResizableConstants.dataPropertyName]);
      assert.deepEqual(rtc, (el as any)[ResizableConstants.dataPropertyName]);
    });

    it('Should fail to construct - undefined table ', function () {
      let theError = '';
      try {
        const rtc = new ResizableTableColumns(void (0) as unknown as HTMLTableElement, null);
      } catch (error) {
        theError = error;
      }

      assert.isTrue(theError.length > 0, 'The lenght of the error mesage(' + theError + ') should be > 0.');
      assert.isTrue(theError.indexOf('Invalid argument: "table".') == 0);
    });

    it('Should fail to construct - null table ', function () {
      let theError = '';
      try {
        const rtc = new ResizableTableColumns(null as unknown as HTMLTableElement, null);
      } catch (error) {
        theError = error;
      }

      assert.isTrue(theError.length > 0, 'The lenght of the error mesage(' + theError + ') should be > 0.');
      assert.isTrue(theError.indexOf('Invalid argument: "table".') == 0);
    });

    it('Should fail to construct - plain object table ', function () {
      let theError = '';
      try {
        const rtc = new ResizableTableColumns({} as unknown as HTMLTableElement, null);
      } catch (error) {
        theError = error;
      }

      assert.isTrue(theError.length > 0, 'The lenght of the error mesage(' + theError + ') should be > 0.');
      assert.isTrue(theError.indexOf('Invalid argument: "table".') == 0);
    });

    it('Should fail to construct - plain HTMLTableElement table ', function () {
      let theError = '';
      const el = DOM.window.document.createElement('table');

      try {
        (el as any)[ResizableConstants.dataPropertyName] = {};
        const rtc = new ResizableTableColumns(el, null);
      } catch (error) {
        theError = error;
      }

      assert.isTrue(theError.length > 0, 'The lenght of the error mesage(' + theError + ') should be > 0.');
      assert.isTrue(theError.indexOf(`Existing "${ResizableConstants.dataPropertyName}" property.`) == 0);
    });

    it('Should fail to construct - missing head and body', function () {
      let theError = '';

      try {
        const el = DOM.window.document.getElementById('missing-head-and-body');
        assert.isNotNull(el, 'Table element should be found in dom');

        const rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error;
      }

      assert.isTrue(theError.length > 0, 'The lenght of the error mesage(' + theError + ') should be > 0.');
      assert.isTrue(theError.indexOf('Markup validation: thead count') == 0, theError);
    });

    it('Should fail to construct - missing head and body 2', function () {
      let theError = '';

      try {
        const el = DOM.window.document.getElementById('missing-head-and-body-2');
        assert.isNotNull(el, 'Table element should be found in dom');

        const rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error;
      }

      assert.isTrue(theError.length > 0, 'The lenght of the error mesage(' + theError + ') should be > 0.');
      assert.isTrue(theError.indexOf('Markup validation: thead count') == 0, theError);
    });

    it('Should fail to construct - missing head', function () {
      let theError = '';

      try {
        const el = DOM.window.document.getElementById('missing-head');
        assert.isNotNull(el, 'Table element should be found in dom');

        const rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error;
      }

      assert.isTrue(theError.length > 0, 'The lenght of the error mesage(' + theError + ') should be > 0.');
      assert.isTrue(theError.indexOf('Markup validation: thead count') == 0, theError);
    });

    it('Should fail to construct - missing body', function () {
      let theError = '';

      try {
        const el = DOM.window.document.getElementById('missing-body');
        assert.isNotNull(el, 'Table element should be found in dom');

        const rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error;
      }

      assert.isTrue(theError.length > 0, 'The lenght of the error mesage(' + theError + ') should be > 0.');
      assert.isTrue(theError.indexOf('Markup validation: tbody count') == 0, theError);
    });

    it('Should fail to construct - multiple heads', function () {
      let theError = '';

      try {
        const el = DOM.window.document.getElementById('double-head');
        assert.isNotNull(el, 'Table element should be found in dom');

        const rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error;
      }

      assert.isTrue(theError.length > 0, 'The lenght of the error mesage(' + theError + ') should be > 0.');
      assert.isTrue(theError.indexOf('Markup validation: thead count') == 0, theError);
    });

    it('Should fail to construct - multiple bodies', function () {
      let theError = '';

      try {
        const el = DOM.window.document.getElementById('double-body');
        assert.isNotNull(el, 'Table element should be found in dom');

        const rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error;
      }

      assert.isTrue(theError.length > 0, 'The lenght of the error mesage(' + theError + ') should be > 0.');
      assert.isTrue(theError.indexOf('Markup validation: tbody count') == 0, theError);
    });

    it('Should fail to construct - invalid header', function () {
      let theError = '';

      try {
        const el = DOM.window.document.getElementById('invalid-header');
        assert.isNotNull(el, 'Table element should be found in dom');

        const rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error;
      }

      assert.isTrue(theError.length > 0, 'The lenght of the error mesage(' + theError + ') should be > 0.');
      assert.isTrue(theError.indexOf('Markup validation: thead first row invalid') == 0, theError);
    });

    it('Should fail to construct - invalid header 2', function () {
      let theError = '';

      try {
        const el = DOM.window.document.getElementById('invalid-header2');
        assert.isNotNull(el, 'Table element should be found in dom');

        const rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error;
      }

      assert.isTrue(theError.length > 0, 'The lenght of the error mesage(' + theError + ') should be > 0.');
      assert.isTrue(theError.indexOf('Markup validation: thead first row cells count') == 0, theError);
    });

    it('Should fail to construct - invalid header 3', function () {
      let theError = '';

      try {
        const el = DOM.window.document.getElementById('invalid-header3');
        assert.isNotNull(el, 'Table element should be found in dom');

        const rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error;
      }

      assert.isTrue(theError.length > 0, 'The lenght of the error mesage(' + theError + ') should be > 0.');
      assert.isTrue(theError.indexOf('Markup validation: thead first row cells count') == 0, theError);
    });

    it('Should fail to construct - invalid header 4', function () {
      let theError = '';

      try {
        const el = DOM.window.document.getElementById('invalid-header4');
        assert.isNotNull(el, 'Table element should be found in dom');

        const rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error;
      }

      assert.isTrue(theError.length > 0, 'The lenght of the error mesage(' + theError + ') should be > 0.');
      assert.isTrue(theError.indexOf('Markup validation: thead row count') == 0, theError);
    });

    it('Each new object should have a new id', function () {
      const el = DOM.window.document.getElementById('valid-table');
      assert.isNotNull(el, 'Table element should be found in dom');

      if (typeof (el as any)[ResizableConstants.dataPropertyName] !== 'undefined') {
        (el as any)[ResizableConstants.dataPropertyName].dispose();
      }

      let rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      const id1 = rtc.id;
      rtc.dispose();

      rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      const id2 = rtc.id;
      rtc.dispose();

      rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      const id3 = rtc.id;
      rtc.dispose();

      assert.equal(id2, id1 + 1);
      assert.equal(id3, id2 + 1);
    });

  });
});
