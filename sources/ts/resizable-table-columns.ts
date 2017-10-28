import ResizableOptions from './resizable-options'
import ResizableConstants from './resizable-constants';
import ResizableEventData from './resizable-event-data';
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
  originalWidths: { [id: string]: string; };
  eventData: ResizableEventData | null;
  lastPointerDown: number;
  windowResizeHandler: any;

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
    this.originalWidths = {};
    this.eventData = null;
    this.lastPointerDown = 0;

    this.init();

    this.table[ResizableConstants.dataPropertyname] = this;
  }

  init() {
    this.validateMarkup();
    this.wrapTable();
    this.asignTableHeaders();
    this.storeHeaderOriginalWidths();
    this.setHeaderWidths();
    this.createDragHandles();
    this.restoreColumnWidths();
    this.checkTableWidth();
    this.syncHandleWidths();

    this.windowResizeHandler = () => {
      this.checkTableWidth();
      this.syncHandleWidths();
    };

    const win = this.ownerDocument.defaultView;
    ResizableConstants.events.windowResize
      .forEach((evt, idx) => {
        win.addEventListener(evt, this.windowResizeHandler, false);
      });
  }

  dispose() {
    const win = this.ownerDocument.defaultView;
    ResizableConstants.events.windowResize
      .forEach((evt, idx) => {
        win.removeEventListener(evt, this.windowResizeHandler, false);
      });

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
    UtilitiesDOM.addClass(this.wrapper, ResizableConstants.classes.wrapper);
    UtilitiesDOM.addClass(this.table, ResizableConstants.classes.table);
  }

  unwrapTable() {
    //TODO: Unit test this
    UtilitiesDOM.removeClass(this.table, ResizableConstants.classes.table);
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

        const width = UtilitiesDOM.getWidth(el);
        let constrainedWidth = this.constrainWidth(el, width);
        ResizableTableColumns.setWidth(el, constrainedWidth);
      });
  }

  constrainWidth(el: HTMLElement, width: number): number {
    //TODO: Unit test this

    let result: number = width;
    const minWidth = this.options.obeyCssMinWidth
      ? UtilitiesDOM.getMinCssWidth(el)
      : null;

    if (minWidth != null) {
      result = Math.max(minWidth, result, this.options.minWidth);
    }

    const maxWidth = this.options.obeyCssMaxWidth
      ? UtilitiesDOM.getMaxCssWidth(el)
      : null;

    if (maxWidth != null) {
      result = Math.min(maxWidth, result, this.options.maxWidth);
    }
    return result;
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

    ResizableConstants.events.pointerDown
      .forEach((evt, evtIdx) => {
        this.dragHandlesContainer.addEventListener(evt, ResizableTableColumns.onPointerDown, false);
      });
  }

  destroyDragHandles() {
    //TODO: Unit test this
    if (this.dragHandlesContainer !== null) {
      ResizableConstants.events.pointerDown
        .forEach((evt, evtIdx) => {
          this.dragHandlesContainer.removeEventListener(evt, ResizableTableColumns.onPointerDown, false);
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

  generateColumnId(el) {
    //TODO: Unit test this
    const columnId = (el.getAttribute(ResizableConstants.attibutes.dataResizable) || '')
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
          const constrainedWidth = this.constrainWidth(el, newWidth)
          ResizableTableColumns.setWidth(el, constrainedWidth);

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
    //TODO: Unit test this
    const tableWidth = UtilitiesDOM.getWidth(this.table);
    ResizableTableColumns.setWidth(this.dragHandlesContainer, tableWidth);
    this.dragHandlesContainer.style.minWidth = `${tableWidth}px`;

    const headers = this.getResizableHeaders();
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

  getResizableHeaders(): HTMLTableCellElement[] {
    //TODO: Unit test this
    return this.tableHeaders
      .filter((el, idx) => {
        return el.hasAttribute(ResizableConstants.attibutes.dataResizable);
      });
  }

  handlePointerDown(dragHandler: HTMLDivElement, event: Event): void {
    //TODO: Unit test this
    const gripIndex = this.getDragHandlers().indexOf(dragHandler);
    const resizableHeaders = this.getResizableHeaders();
    if (gripIndex >= resizableHeaders.length)
      return;

    const millisecondsNow = (new Date()).getTime();
    const isDoubleClick = (millisecondsNow - this.lastPointerDown) < this.options.doubleClickDelay;
    const column = resizableHeaders[gripIndex];
    const columnWidth = UtilitiesDOM.getWidth(column);
    const tableWidth = UtilitiesDOM.getWidth(this.table);

    const eventData: ResizableEventData = new ResizableEventData();
    eventData.column = column;
    eventData.dragHandler = dragHandler;
    eventData.pointer = {
      x: this.getPointerX(event),
      isDoubleClick: isDoubleClick
    };
    eventData.originalWidths = {
      column: columnWidth,
      table: tableWidth
    };

    this.detachHandlers(); //make sure we do not have extra handlers
    this.attachHandlers();

    UtilitiesDOM.addClass(this.table, ResizableConstants.classes.tableResizing);
    UtilitiesDOM.addClass(this.wrapper, ResizableConstants.classes.tableResizing);
    UtilitiesDOM.addClass(dragHandler, ResizableConstants.classes.columnResizing);
    UtilitiesDOM.addClass(column, ResizableConstants.classes.columnResizing);

    this.lastPointerDown = millisecondsNow;
    this.eventData = eventData;

    var eventToDispatch = new CustomEvent(ResizableConstants.events.eventResizeStart, {
      detail: {
        column: column,
        columnWidth: columnWidth,
        table: this.table,
        tableWidth: tableWidth
      }
    });
    this.table.dispatchEvent(eventToDispatch);
    event.preventDefault();
  }

  handlePointerMove(event: Event): void {
    //TODO: Unit test this
    if (!this.eventData)
      return;

    const difference = this.getPointerX(event) - this.eventData.pointer.x;
    if (difference === 0) {
      return;
    }

    const tableWidth = this.eventData.originalWidths.table + difference;
    const columnWidth = this.constrainWidth(this.eventData.column, this.eventData.originalWidths.column + difference);
    ResizableTableColumns.setWidth(this.table, tableWidth);
    ResizableTableColumns.setWidth(this.eventData.column, columnWidth);

    this.eventData.newWidths = {
      column: columnWidth,
      table: tableWidth
    };
    var eventToDispatch = new CustomEvent(ResizableConstants.events.eventResize, {
      detail: {
        column: this.eventData.column,
        columnWidth: columnWidth,
        table: this.table,
        tableWidth: tableWidth
      }
    });
    this.table.dispatchEvent(eventToDispatch);
  }

  handlePointerUp(event: Event): void {
    //TODO: Unit test this
    this.detachHandlers();

    if (!this.eventData)
      return;

    if (this.eventData.pointer.isDoubleClick) {
      this.handleDoubleClick(event)
    }

    UtilitiesDOM.removeClass(this.table, ResizableConstants.classes.tableResizing);
    UtilitiesDOM.removeClass(this.wrapper, ResizableConstants.classes.tableResizing);
    UtilitiesDOM.removeClass(this.eventData.dragHandler, ResizableConstants.classes.columnResizing);
    UtilitiesDOM.removeClass(this.eventData.column, ResizableConstants.classes.columnResizing);

    this.checkTableWidth();
    this.syncHandleWidths();
    this.refreshWrapperStyle();
    this.saveColumnWidths();

    const widths = this.eventData.newWidths || this.eventData.originalWidths;
    var eventToDispatch = new CustomEvent(ResizableConstants.events.eventResizeStop, {
      detail: {
        column: this.eventData.column,
        columnWidth: widths.column,
        table: this.table,
        tableWidth: widths.table
      }
    });
    this.table.dispatchEvent(eventToDispatch);

    this.eventData = null;
  }

  handleDoubleClick(event) {
    if (!this.eventData || !this.eventData.column)
      return;

    const column = this.eventData.column;
    const colIndex = this.tableHeaders.indexOf(column);

    let maxWidth = 0;
    let indecesToSkip = [];
    this.tableHeaders
      .forEach((el, idx) => {
        if (!el.hasAttribute(ResizableConstants.attibutes.dataResizable)) {
          indecesToSkip.push(idx);
        }
      });

    const span = this.ownerDocument.createElement('span');
    span.style.position = 'absolute';
    span.style.left = '-99999px';
    span.style.top = '-99999px';
    span.style.visibility = 'hidden';
    this.ownerDocument.body.appendChild(span);


    const rows = this.table.querySelectorAll('tr');
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const element = rows[rowIndex];
      const cells = element.querySelectorAll('td, th');
      let currentIndex = 0;

      for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
        const cell = cells[cellIndex];
        let colSpan = 1;
        if (cell.hasAttribute('colspan')) {
          const colSpanString = cell.getAttribute('colspan') || '1';
          const parsed = parseInt(colSpanString);
          if (!isNaN(parsed)) {
            colSpan = parsed;
          } else {
            colSpan = 1;
          }
        }

        if (indecesToSkip.indexOf(cellIndex) === -1
          && colSpan === 1
          && currentIndex === colIndex) {
          maxWidth = Math.max(maxWidth, UtilitiesDOM.getTextWidth(<HTMLElement>cell, span))
          break;
        }

        currentIndex += colSpan;
      }
    }


    this.ownerDocument.body.removeChild(span);

    const difference = maxWidth - UtilitiesDOM.getWidth(column);
    if (difference === 0) {
      return;
    }

    const tableWidth = this.eventData.originalWidths.table + difference;
    const columnWidth = this.constrainWidth(this.eventData.column, this.eventData.originalWidths.column + difference);
    ResizableTableColumns.setWidth(this.table, tableWidth);
    ResizableTableColumns.setWidth(this.eventData.column, columnWidth);

    this.eventData.newWidths = {
      column: columnWidth,
      table: tableWidth
    };
    var eventToDispatch = new CustomEvent(ResizableConstants.events.eventResize, {
      detail: {
        column: this.eventData.column,
        columnWidth: columnWidth,
        table: this.table,
        tableWidth: tableWidth
      }
    });
    this.table.dispatchEvent(eventToDispatch);
  }

  getPointerX(event): number {
    //TODO: Unit test this
    if (event.type.indexOf('touch') === 0) {
      return (event.touches[0] || event.changedTouches[0]).pageX;
    }
    return event.pageX;
  }

  attachHandlers(): void {
    //TODO: Unit test this
    ResizableConstants.events.pointerMove
      .forEach((evt, evtIdx) => {
        this.ownerDocument.addEventListener(evt, ResizableTableColumns.onPointerMove, false);
      });

    ResizableConstants.events.pointerUp
      .forEach((evt, evtIdx) => {
        this.ownerDocument.addEventListener(evt, ResizableTableColumns.onPointerUp, false);
      });
  }

  detachHandlers(): void {
    //TODO: Unit test this
    ResizableConstants.events.pointerMove
      .forEach((evt, evtIdx) => {
        this.ownerDocument.removeEventListener(evt, ResizableTableColumns.onPointerMove, false);
      });

    ResizableConstants.events.pointerUp
      .forEach((evt, evtIdx) => {
        this.ownerDocument.removeEventListener(evt, ResizableTableColumns.onPointerUp, false);
      });
  }

  refreshWrapperStyle(): void {
    //TODO: Unit test this
    if (this.wrapper == null)
      return;

    const original = this.wrapper.style.overflowX;
    this.wrapper.style.overflowX = 'hidden';
    this.wrapper.style.overflowX = original;

  }

  saveColumnWidths() {
    //TODO: Unit test this
    if (!this.options.store)
      return;

    this.getResizableHeaders()
      .forEach((el, idx) => {
        this.options.store.set(this.generateColumnId(el), UtilitiesDOM.getWidth(el));
      });
  }

  static setWidth(element: HTMLElement, width: number) {
    //TODO: Unit test this
    let strWidth = width.toFixed(2);
    strWidth = width > 0 ? strWidth : '0';
    element.style.width = `${strWidth}px`;
  }

  static getInstanceId(): number {
    //TODO: Unit test this
    return ResizableTableColumns.instancesCount++;
  }

  static onPointerDown(evt: Event): void {
    const rtc = ResizableTableColumns.getResizableObject(event);
    if (!rtc)
      return;

    //in case we missed a previous action
    rtc.handlePointerUp(event);

    const target = evt.target as HTMLElement;
    if (target == null)
      return;

    if (target.nodeName !== 'DIV' || !UtilitiesDOM.hasClass(target, ResizableConstants.classes.handle))
      return;

    if (typeof (<any>evt).button === 'number' && (<any>evt).button !== 0)
      return; // this is not a left click

    rtc.handlePointerDown(<HTMLDivElement>target, evt);
  }

  static onPointerMove(evt: Event): void {
    const rtc = ResizableTableColumns.getResizableObject(event);
    if (!rtc)
      return;

    rtc.handlePointerMove(event);

  }

  static onPointerUp(evt: Event): void {
    //TODO: Unit test this
    const rtc = ResizableTableColumns.getResizableObject(event);
    if (!rtc)
      return;

    rtc.handlePointerUp(event);
  }

  static getResizableObject(evt: Event): ResizableTableColumns | null {
    //TODO: Unit test this
    if (!evt)
      return null;

    const target = evt.target as HTMLElement;
    if (target == null)
      return null;

    const tableWrapper = UtilitiesDOM.closest(target, `div.${ResizableConstants.classes.wrapper}`);
    if (!tableWrapper)
      return null;

    const table = tableWrapper.querySelector(`table.${ResizableConstants.classes.table}`);
    if (!table)
      return null;

    return table[ResizableConstants.dataPropertyname] || null;
  }
}
