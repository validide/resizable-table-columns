import ResizableOptions from './resizable-options'
import ResizableConstants from './resizable-constants';
import Utilities from './utilities'
import UtilitiesDOM from './utilities-dom'

export default class ResizableTableColumns {
  table: HTMLTableElement;
  options: ResizableOptions;

  wrapper: HTMLDivElement | null;
  ownerDocument: Document;
  tableHeaders: HTMLTableHeaderCellElement[]

  constructor(table: HTMLTableElement, options: ResizableOptions) {
    if (typeof table !== 'object' || table === null || (<object>table).toString() !== '[object HTMLTableElement]')
      throw 'Invalid argument: "table".\nResizableTableColumns requires that the table element is a not null HTMLTableElement object!';

    if (typeof table[ResizableConstants.dataPropertyname] !== 'undefined')
      throw `Existing "${ResizableConstants.dataPropertyname}" property.\nTable elemet already has a '${ResizableConstants.dataPropertyname}' attached object!`;

    this.table = table;
    this.options = new ResizableOptions(options, table);

    this.ownerDocument = table.ownerDocument;
    this.wrapper = null;

    this.init();

    this.table[ResizableConstants.dataPropertyname] = this;
  }

  init() {
    this.validateMarkup();
    this.wrapTable();
    this.asignTableHeaders();
    this.setHeaderWidths();
    this.createDragHandles();

    UtilitiesDOM.addClass(this.wrapper, ResizableConstants.classes.wrapperClass);
    UtilitiesDOM.addClass(this.table, ResizableConstants.classes.tableClass);
  }

  dispose() {


    UtilitiesDOM.removeClass(this.table, ResizableConstants.classes.tableClass);
    this.unwrapTable();
    this.table[ResizableConstants.dataPropertyname] = void (0);
  }

  validateMarkup(): void {
    let theadCount = 0;
    let tbodyCount = 0;
    let thead: Node;
    for (let index = 0; index < this.table.childNodes.length; index++) {
      const element = this.table.childNodes[index];
      if (element.nodeName === 'THEAD') {
        theadCount++;
        thead = element;
      }
      else if (element.nodeName === 'TBODY') {
        tbodyCount++;
      }
    }

    if (theadCount !== 1)
      throw `Markup validation: thead count.\nResizableTableColumns requires that the table element has one(1) table head element. Current count: ${theadCount}`;

    if (tbodyCount !== 1)
      throw `Markup validation: tbody count.\nResizableTableColumns requires that the table element has one(1) table body element. Current count: ${tbodyCount}`;

    let theadRowCount = 0;
    let firstRow = null;
    for (let index = 0; index < thead.childNodes.length; index++) {
      const element = thead.childNodes[index];
      if (element.nodeName === 'TR') {
        theadRowCount++;
        if (firstRow === null) {
          firstRow = element;
        }
      }
    }

    if (theadRowCount < 1)
      throw `Markup validation: thead row count.\nResizableTableColumns requires that the table head element has at least one(1) table row element. Current count: ${theadRowCount}`;

    let headerCellsCount = 0;
    let invalidHeaderCellsCount = 0;
    for (let index = 0; index < firstRow.childNodes.length; index++) {
      const element = firstRow.childNodes[index];
      if (element.nodeName === 'TH') {
        headerCellsCount++;
      } else if (element.nodeName === 'TD') {
        invalidHeaderCellsCount++;
      }
    }

    if (headerCellsCount < 1)
      throw `Markup validation: thead first row cells count.\nResizableTableColumns requires that the table head's first row element has at least one(1) table header cell element. Current count: ${headerCellsCount}`;

    if (invalidHeaderCellsCount !== 0)
      throw `Markup validation: thead first row invalid.\nResizableTableColumns requires that the table head's first row element has no(0) table cell(TD) elements. Current count: ${invalidHeaderCellsCount}`;
  }

  wrapTable() {
    //TODO: Unit test this
    if (this.wrapper)
      return;

    this.wrapper = this.ownerDocument.createElement('div');
    const tableOriginalParent = this.table.parentNode;
    tableOriginalParent.insertBefore(this.wrapper, this.table);
    tableOriginalParent.removeChild(this.table);
    this.wrapper.appendChild(this.table);
  }

  unwrapTable() {
    //TODO: Unit test this
    if (!this.wrapper)
      return;

    const tableOriginalParent = this.wrapper.parentNode;
    tableOriginalParent.insertBefore(this.table, this.wrapper);
    tableOriginalParent.removeChild(this.wrapper);
    this.wrapper = null;
  }

  asignTableHeaders() {
    //TODO: Unit test this
    this.tableHeaders = [];
    let firstTableRow;
    for (let index = 0; index < this.table.childNodes.length; index++) {
      const element = this.table.childNodes[index];
      if (element.nodeName === 'THEAD') {
        firstTableRow = element;
        break;
      }
    }

    for (let index = 0; index < firstTableRow.childNodes.length; index++) {
      const element = firstTableRow.childNodes[index];
      if (element.nodeName === 'TH') {
        this.tableHeaders.push(element);
      }
    }
  }

  setHeaderWidths() {
    //TODO: Unit test this
    this.tableHeaders
      .forEach((el, idx) => {
        if (!el.hasAttribute(ResizableConstants.attibutes.dataResizable))
          return;

        const paddingLeft = <number>Utilities.parseStyleDimension(getComputedStyle(el)['paddingLeft'], false);
        const paddingRight = <number>Utilities.parseStyleDimension(getComputedStyle(el)['paddingRight'], false);
        let width = el.offsetWidth - paddingLeft - paddingRight;

        const minWidth = this.options.obeyCssMinWidth
          ? UtilitiesDOM.getMinCssWidth(el)
          : null;

        if (minWidth != null) {
          width = Math.max(minWidth, width, this.options.minWidth);
        }

        const maxWidth = this.options.obeyCssMaxWidth
          ? UtilitiesDOM.getMaxCssWidth(el)
          : null;

        if (maxWidth != null) {
          width = Math.min(maxWidth, width, this.options.maxWidth);
        }
        ResizableTableColumns.setWidth(el, width);
      });
  }

  static setWidth(element: HTMLElement, width: number) {
    //TODO: Unit test this
    let strWidth = width.toFixed(2);
    strWidth = width > 0 ? strWidth : '0';
    element.style.width = `${strWidth}px`;
  }

  createDragHandles() {
    //TODO: Unit test this

  }

}
