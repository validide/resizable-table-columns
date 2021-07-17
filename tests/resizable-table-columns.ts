/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai/index.d.ts" />
/// <reference path="../node_modules/@types/jsdom/index.d.ts" />

import { assert } from 'chai';
import { JSDOM } from 'jsdom';
import { ResizableConstants } from '../sources/ts/resizable-constants';
import { ResizableOptions } from '../sources/ts/resizable-options';
import { ResizableTableColumns } from '../sources/ts/resizable-table-columns';
import { UtilitiesDOM } from '../sources/ts/utilities-dom';

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

  const dynamicTable = `<table style="width: 7000px">
  <thead>
    <tr>
      <th id="th1" style="width: 110px">No.</th>
      <th id="th2" style="width: 120px">Name</th>
      <th id="th3" style="width: 130px">Counrty</th>
      <th id="th4" style="width: 140px">Region</th>
      <th id="th5" style="width: 150px">City</th>
      <th id="th6" style="width: 160px">Street</th>
      <th id="th7" style="width: 170px">Post Code</th>
      <th id="th8" style="width: 180px">Last updated</th>
      <th id="th9" style="width: 190px">UUID</th>
    </tr>
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
</table>`;

  const el = DOM.window.document.getElementById('valid-table') as HTMLTableElement;
  const rtc = new ResizableTableColumns(el, null);

  describe('Constructor calls', function () {

    let container: HTMLElement, el: HTMLTableElement, rtc: ResizableTableColumns;
    before(function () {
      container = DOM.window.document.createElement('div');
      container.innerHTML = dynamicTable;

      DOM.window.document.body.appendChild(container);
      const overriders = new ResizableOptions();
      overriders.minWidth = 130;
      overriders.maxWidth = 170;
      el = container.querySelector('table') as HTMLTableElement;
      rtc = new ResizableTableColumns(el, overriders);
    });

    after(function () {
      rtc.dispose();
      DOM.window.document.body.removeChild(container);
    });

    it('Should ".wrapTable()"', function () {
      const wrapper = el.parentNode as HTMLElement;
      assert.isNotNull(wrapper, 'Table wrapper is missing.');
      assert.equal(wrapper.nodeName, 'DIV', 'Table wrapper is not a DIV.');
      assert.isTrue(wrapper.classList.contains('rtc-wrapper'), 'Table wrapper does not have the required class.');
      assert.isTrue(el.classList.contains('rtc-table'), 'Table does not have the required class.');
    });

    it('Should ".asignTableHeaders()"', function () {
      assert.isNotNull(rtc.tableHeaders, '"tableHeaders" is null.');
      assert.equal(rtc.tableHeaders.length, 9, '"tableHeaders" count mismatch.');
      for (let index = 0; index < rtc.tableHeaders.length; index++) {
        let th = rtc.tableHeaders[index];
        assert.equal(th.id, `th${index + 1}`, 'Header order mismatch.');
      }
    });

    it('Should ".storeOriginalWidths()"', function () {
      assert.isNotNull(rtc.originalWidths, '"originalWidths" is null.');
      assert.equal(rtc.originalWidths[rtc.originalWidths.length - 1].detail, '7000px');

      for (let index = 0; index < rtc.tableHeaders.length - 1; index++) {
        const th = rtc.tableHeaders[index];
        assert.equal(rtc.originalWidths[index].detail, (100 + ((index + 1) * 10)) + 'px');
      }
    });

    it('Should ".setHeaderWidths()"', function () {
      for (let index = 0; index < rtc.tableHeaders.length; index++) {
        const th = rtc.tableHeaders[index];
        let width = rtc.constrainWidth(th, th.offsetWidth);
        assert.equal(th.style.width, (width.toFixed(2)) + 'px', `Column index ${index}`);
      }
    });

    it('Should ".createDragHandles()"', function () {
      const dragWrapper = el.parentNode?.childNodes[0] as HTMLElement;
      assert.isNotNull(dragWrapper, 'Drag wrapper is missing.');
      assert.equal(dragWrapper.nodeName, 'DIV', 'Drag wrapper is not a DIV.');
      assert.isTrue(dragWrapper.classList.contains('rtc-handle-container'), 'Drag wrapper does not have the required class.');

      const resizableHeaders = rtc.getResizableHeaders();
      assert.equal(dragWrapper.childNodes.length, resizableHeaders.length);

      for (let index = 0; index < dragWrapper.childNodes.length; index++) {
        assert.isTrue((dragWrapper.childNodes as any)[index].classList.contains('rtc-handle'));
      }
    });
  });

  describe('Dispose calls', function () {
    let container: HTMLElement, el: HTMLTableElement, rtc: ResizableTableColumns;
    before(function () {
      container = DOM.window.document.createElement('div');
      container.innerHTML = dynamicTable;

      DOM.window.document.body.appendChild(container);
      el = container.querySelector('table') as HTMLTableElement;
      rtc = new ResizableTableColumns(el, null);
      rtc.dispose();
    });

    after(function () {
      DOM.window.document.body.removeChild(container);
    });

    it('Should ".unwrapTable()"', function () {
      assert.equal(el.parentNode, container, 'The "unwrapTable" method failed to restpre the original parent.');
      assert.isFalse(el.classList.contains('rtc-table'), 'Table still has the required class.');
    });

    it('Should ".restoreOriginalWidths()"', function () {
      for (let index = 1; index <= 9; index++) {
        const th = DOM.window.document.getElementById(`th${index}`) as HTMLElement;
        assert.equal(th.style.width, (100 + ((index) * 10)) + 'px');
      }
      assert.equal(el.style.width, '7000px', 'Original table width was not restored.');
    });

    it('Should ".destroyDragHandles()"', function () {
      assert.equal(container.querySelectorAll('.rtc-handle-container').length, 0);
      assert.equal(container.querySelectorAll('.rtc-handle').length, 0);
    });
  });

  describe('Instance methods', function () {
    it('.getResizableHeaders()', function () {
      const unresizable = rtc.getResizableHeaders()
        .filter((el, idx) => {
          return !el.hasAttribute('data-rtc-resizable');
        });
      assert.equal(unresizable.length, 0);
    });

    it('.getDragHandlers()', function () {
      const dragHandlers = rtc.getDragHandlers();
      for (let index = 0; index < dragHandlers.length; index++) {
        assert.equal(dragHandlers[index].nodeName, 'DIV');
        assert.isTrue(dragHandlers[index].classList.contains('rtc-handle'));
      }
    });
  });

  describe('.createHandlerReferences()', function () {
    it('Create "onPointerDownRef"', function () {
      assert.isTrue(typeof rtc.onPointerDownRef === 'function');
    });

    it('Create "onPointerMoveRef"', function () {
      assert.isTrue(typeof rtc.onPointerMoveRef === 'function');
    });

    it('Create "onPointerUpRef"', function () {
      assert.isTrue(typeof rtc.onPointerUpRef === 'function');
    });
  });

  describe('.registerWindowResizeHandler()', function () {
    it('Should be true "registerWindowResizeHandler"', function () {
      assert.isTrue(ResizableTableColumns.windowResizeHandlerRef != null);
    });
  });

  describe('static.generateTableId()', function () {
    it('Should be "" (empty string) if attriute is missing', function () {
      const el = DOM.window.document.createElement('table');
      const id = ResizableTableColumns.generateTableId(el);
      assert.equal(id, '');
    });

    it('Should be "rtc/table_one" if attriute value is " table_one "', function () {
      const el = DOM.window.document.createElement('table');
      el.setAttribute('data-rtc-resizable-table', ' table_one ')
      const id = ResizableTableColumns.generateTableId(el);
      assert.equal(id, 'rtc/table_one');
    });

    it('Should be "rtc/table_two_two" if attriute value is "table.two.two"', function () {
      const el = DOM.window.document.createElement('table');
      el.setAttribute('data-rtc-resizable-table', 'table.two.two')
      const id = ResizableTableColumns.generateTableId(el);
      assert.equal(id, 'rtc/table_two_two');
    });
  });

  describe('static.generateColumnId()', function () {
    it('Should be "" (empty string) if attriute is missing', function () {
      const el = DOM.window.document.createElement('div');
      const id = ResizableTableColumns.generateColumnId(el);
      assert.equal(id, '');
    });

    it('Should be "column_one" if attriute value is " column_one "', function () {
      const el = DOM.window.document.createElement('div');
      el.setAttribute('data-rtc-resizable', ' column_one ')
      const id = ResizableTableColumns.generateColumnId(el);
      assert.equal(id, 'column_one');
    });

    it('Should be "cell_two_two" if attriute value is "cell.two.two"', function () {
      const el = DOM.window.document.createElement('div');
      el.setAttribute('data-rtc-resizable', 'cell.two.two')
      const id = ResizableTableColumns.generateColumnId(el);
      assert.equal(id, 'cell_two_two');
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
