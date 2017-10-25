import ResizableOptions from './resizable-options'
import ResizableConstants from './resizable-constants';
import Utilities from './utilities'
import UtilitiesDOM from './utilities-dom'

export default class ResizableTableColumns {
  static instancesCount: number = 0;

  table: HTMLTableElement;
  options: ResizableOptions;

  id: number;
  wrapper: HTMLDivElement | null;
  ownerDocument: Document;
  tableHeaders: HTMLTableHeaderCellElement[];
  dragHandlesContainer: HTMLDivElement | null;
  originalWidths: { [id: string]: string; } = {};

  constructor(table: HTMLTableElement, options: ResizableOptions) {
    if (typeof table !== 'object' || table === null || (<object>table).toString() !== '[object HTMLTableElement]')
      throw 'Invalid argument: "table".\nResizableTableColumns requires that the table element is a not null HTMLTableElement object!';

    if (typeof table[ResizableConstants.dataPropertyname] !== 'undefined')
      throw `Existing "${ResizableConstants.dataPropertyname}" property.\nTable elemet already has a '${ResizableConstants.dataPropertyname}' attached object!`;

    this.id = ResizableTableColumns.getInstanceId();
    this.table = table;
    this.options = new ResizableOptions(options, table);

    this.wrapper = null;
    this.ownerDocument = table.ownerDocument;
    this.tableHeaders = [];
    this.dragHandlesContainer = null;

    this.init();

    this.table[ResizableConstants.dataPropertyname] = this;
  }

  init() {
    this.validateMarkup();
    this.wrapTable();
    UtilitiesDOM.addClass(this.wrapper, ResizableConstants.classes.wrapper);
    UtilitiesDOM.addClass(this.table, ResizableConstants.classes.table);

    this.asignTableHeaders();
    this.storeHeaderOriginalWidths();
    this.setHeaderWidths();
    this.createDragHandles();
    this.restoreColumnWidths();
    this.checkTableWidth();
    this.syncHandleWidths();
  }

  dispose() {
    UtilitiesDOM.removeClass(this.table, ResizableConstants.classes.table);
    this.destroyDragHandles();
    this.restoreHeaderOriginalWidths();
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
    let tableHeader;
    let firstTableRow;
    for (let index = 0; index < this.table.childNodes.length; index++) {
      const element = this.table.childNodes[index];
      if (element.nodeName === 'THEAD') {
        tableHeader = element;
        break;
      }
    }

    for (let index = 0; index < tableHeader.childNodes.length; index++) {
      const element = tableHeader.childNodes[index];
      if (element.nodeName === 'TR') {
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

  storeHeaderOriginalWidths() {
    //TODO: Unit test this
    this.tableHeaders
      .forEach((el, idx) => {
        if (!el.hasAttribute(ResizableConstants.attibutes.dataResizable))
          return;

        const columnName = el.getAttribute(ResizableConstants.attibutes.dataResizable);
        this.originalWidths[`___.${columnName}`] = el.style.width;
      });
  }

  restoreHeaderOriginalWidths() {
    //TODO: Unit test this
    this.tableHeaders
      .forEach((el, idx) => {
        if (!el.hasAttribute(ResizableConstants.attibutes.dataResizable))
          return;

        const columnName = el.getAttribute(ResizableConstants.attibutes.dataResizable);
        el.style.width = this.originalWidths[`___.${columnName}`];
      });
  }

  setHeaderWidths() {
    //TODO: Unit test this
    this.tableHeaders
      .forEach((el, idx) => {
        if (!el.hasAttribute(ResizableConstants.attibutes.dataResizable))
          return;

        let width = UtilitiesDOM.getWidth(el);

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
    if (this.dragHandlesContainer != null)
      throw 'Drag handlers allready created. Call <destroyDragHandles> if you wish to recreate them';


    this.dragHandlesContainer = this.ownerDocument.createElement('div');
    this.wrapper.insertBefore(this.dragHandlesContainer, this.table);
    UtilitiesDOM.addClass(this.dragHandlesContainer, ResizableConstants.classes.handleContainer);

    this.tableHeaders
      .forEach((el, idx) => {
        if (!el.hasAttribute(ResizableConstants.attibutes.dataResizable))
          return;

        const handler = this.ownerDocument.createElement('div');
        UtilitiesDOM.addClass(handler, ResizableConstants.classes.handle);
        this.dragHandlesContainer.appendChild(handler);
      });

    this.getDragHandlers()
      .forEach((el, idx) => {
        ResizableConstants.events.pointerDown
          .forEach((evt, evtIdx) => {
            el.addEventListener(evt, ResizableTableColumns.onPointerDown, false);
          });
      });
  }

  destroyDragHandles() {
    //TODO: Unit test this
    if (this.dragHandlesContainer !== null) {
      this.getDragHandlers()
        .forEach((el, idx) => {
          ResizableConstants.events.pointerDown
            .forEach((evt, evtIdx) => {
              el.removeEventListener(evt, ResizableTableColumns.onPointerDown, false);
            });
        });
      this.dragHandlesContainer.parentElement.removeChild(this.dragHandlesContainer);
    }
  }

  getDragHandlers(): Array<HTMLDivElement> {
    //TODO: Unit test this
    const nodes = this.dragHandlesContainer == null
      ? null
      : this.dragHandlesContainer.querySelectorAll(`.${ResizableConstants.classes.handle}`);

    return nodes
      ? Array.prototype.slice.call(nodes).filter((el) => { return el.nodeName === 'DIV' })
      : new Array<HTMLDivElement>();
  }

  restoreColumnWidths() {
    //TODO: Unit test this
    if (!this.options.store)
      return;

    this.tableHeaders
      .forEach((el, idx) => {
        if (!el.hasAttribute(ResizableConstants.attibutes.dataResizable))
          return;

        const width = this.options.store.get(this.generateColumnId(el));
        if (width != null) {
          ResizableTableColumns.setWidth(el, width);
        }
      });
  }

  generateColumnId($el) {
    //TODO: Unit test this
    const columnId = ($el.getAttribute(ResizableConstants.attibutes.dataResizable) || '')
      .trim()
      .replace(/\./g, '_');

    return `${this.generateTableId()}-${columnId}`;
  }

  generateTableId() {
    //TODO: Unit test this
    const tableId = (this.table.getAttribute(ResizableConstants.attibutes.dataResizableTable) || '')
      .trim()
      .replace(/\./g, '_');

    return tableId.length === 0
      ? `rtc-table-${this.id}`
      : tableId;
  }

  checkTableWidth() {
    //TODO: Unit test this
    UtilitiesDOM.addClass(this.table, ResizableConstants.classes.hidden);
    UtilitiesDOM.addClass(this.dragHandlesContainer, ResizableConstants.classes.hidden);

    let wrappperWidth = UtilitiesDOM.getWidth(this.wrapper);

    UtilitiesDOM.removeClass(this.table, ResizableConstants.classes.hidden);
    UtilitiesDOM.removeClass(this.dragHandlesContainer, ResizableConstants.classes.hidden);

    //might bee needed to exclude margins/borders/paddings
    let tableWidth = UtilitiesDOM.getOuterWidth(this.table, true);
    let difference = wrappperWidth - tableWidth;
    if (difference > 0) {

      let totalWidth = 0;
      let resizableWidth = 0;
      let addedWidth = 0;
      let widths = [];

      this.tableHeaders
        .forEach((el, idx) => {
          //might bee needed to include margins/borders/paddings
          const width = UtilitiesDOM.getWidth(el);
          widths.push(width);
          totalWidth += width;
          if (el.hasAttribute(ResizableConstants.attibutes.dataResizable)) {
            resizableWidth += width;
          }
        });

      ResizableTableColumns.setWidth(this.table, wrappperWidth);


      for (let index = 0; index < this.tableHeaders.length; index++) {
        const el = this.tableHeaders[index];
        const currentWidth = widths.shift();

        if (el.hasAttribute(ResizableConstants.attibutes.dataResizable)) {
          let newWidth = currentWidth + ((currentWidth / resizableWidth) * difference);
          let leftToAdd = totalWidth + difference - addedWidth;

          newWidth = Math.min(newWidth, leftToAdd);
          newWidth = Math.max(newWidth, 0); // Do not add a negative width

          ResizableTableColumns.setWidth(el, newWidth);

          addedWidth += newWidth;
        } else {
          addedWidth += currentWidth;
        }

        if (addedWidth >= totalWidth)
          break;
      }
    }
  }

  syncHandleWidths() {
    const tableWidth = UtilitiesDOM.getWidth(this.table);
    ResizableTableColumns.setWidth(this.dragHandlesContainer, tableWidth);
    this.dragHandlesContainer.style.minWidth = `${tableWidth}px`;

    const headers = this.tableHeaders
      .filter((el, idx) => {
        return el.hasAttribute(ResizableConstants.attibutes.dataResizable);
      });

    this.getDragHandlers()
      .forEach((el, idx) => {
        const height = UtilitiesDOM.getInnerHeight(this.options.resizeFromBody ? this.table : this.table.tHead);

        if (idx < headers.length) {
          const th = headers[idx];
          const computedStyles = getComputedStyle(th);
          let left = UtilitiesDOM.getOuterWidth(th);
          left -= <number>Utilities.parseStyleDimension(computedStyles.paddingLeft, false);
          left -= <number>Utilities.parseStyleDimension(computedStyles.paddingRight, false);
          left += UtilitiesDOM.getOffset(th).left;
          left -= UtilitiesDOM.getOffset(this.dragHandlesContainer).left;
          el.style.left = `${left}px`;
          el.style.height = `${height}px`;
        }
      });
  }

  static getInstanceId(): number {
    //TODO: Unit test this
    return ResizableTableColumns.instancesCount++;
  }

  static onPointerDown(evt: Event): void {
    //TODO: Unit test this
    console.log('onPointerDown');
  }
}
