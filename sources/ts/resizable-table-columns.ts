import ResizableOptions from './resizable-options'
import ResizableConstants from './resizable-constants';
import ResizableEventData from './resizable-event-data';
import Utilities from './utilities'
import UtilitiesDOM from './utilities-dom'

class ResizableTableColumns {
  static instancesCount: number = 0;
  static windowResizeHandlerRegistered: boolean = false;

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
  onPointerDownRef: any;
  onPointerMoveRef: any;
  onPointerUpRef: any;


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
    this.createHandlerReferences();
    this.wrapTable();
    this.asignTableHeaders();
    this.storeOriginalWidths();
    this.setHeaderWidths();
    this.createDragHandles();
    this.restoreColumnWidths();
    this.checkTableWidth();
    this.syncHandleWidths();
    this.registerWindowResizeHandler();
  }

  dispose() {
    this.destroyDragHandles();
    this.restoreOriginalWidths();
    this.unwrapTable();
    this.onPointerDownRef = null;
    this.onPointerMoveRef = null;
    this.onPointerUpRef = null;
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
    UtilitiesDOM.removeClass(this.table, ResizableConstants.classes.table);
    if (!this.wrapper)
      return;

    const tableOriginalParent = this.wrapper.parentNode;
    tableOriginalParent.insertBefore(this.table, this.wrapper);
    tableOriginalParent.removeChild(this.wrapper);
    this.wrapper = null;
  }

  asignTableHeaders() {
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

  storeOriginalWidths() {
    this.tableHeaders
      .forEach((el, idx) => {
        this.originalWidths[`___.${idx}`] = el.style.width;
      });
    this.originalWidths[`___.table`] = this.table.style.width;
  }

  restoreOriginalWidths() {
    this.tableHeaders
      .forEach((el, idx) => {
        el.style.width = this.originalWidths[`___.${idx}`];
      });
    this.table.style.width = this.originalWidths[`___.table`];
  }

  setHeaderWidths() {
    this.tableHeaders
      .forEach((el, idx) => {
        const width = UtilitiesDOM.getWidth(el);
        let constrainedWidth = this.constrainWidth(el, width);
        ResizableTableColumns.setWidth(el, constrainedWidth);
      });
  }

  constrainWidth(el: HTMLElement, width: number): number {
    let result: number = width;
    const minWidth = this.options.obeyCssMinWidth
      ? UtilitiesDOM.getMinCssWidth(el)
      : -Infinity;

    result = Math.max(result, minWidth, this.options.minWidth || -Infinity);

    const maxWidth = this.options.obeyCssMaxWidth
      ? UtilitiesDOM.getMaxCssWidth(el)
      : +Infinity;

    result = Math.min(result, maxWidth, this.options.maxWidth || +Infinity);

    return result;
  }

  createDragHandles() {
    if (this.dragHandlesContainer != null)
      throw 'Drag handlers allready created. Call <destroyDragHandles> if you wish to recreate them';


    this.dragHandlesContainer = this.ownerDocument.createElement('div');
    this.wrapper.insertBefore(this.dragHandlesContainer, this.table);
    UtilitiesDOM.addClass(this.dragHandlesContainer, ResizableConstants.classes.handleContainer);

    this.getResizableHeaders()
      .forEach((el, idx) => {
        const handler = this.ownerDocument.createElement('div');
        UtilitiesDOM.addClass(handler, ResizableConstants.classes.handle);
        this.dragHandlesContainer.appendChild(handler);
      });

    ResizableConstants.events.pointerDown
      .forEach((evt, evtIdx) => {
        this.dragHandlesContainer.addEventListener(evt, this.onPointerDownRef, false);
      });
  }

  destroyDragHandles() {
    if (this.dragHandlesContainer !== null) {
      ResizableConstants.events.pointerDown
        .forEach((evt, evtIdx) => {
          this.dragHandlesContainer.removeEventListener(evt, this.onPointerDownRef, false);
        });
      this.dragHandlesContainer.parentElement.removeChild(this.dragHandlesContainer);
    }
  }

  getDragHandlers(): Array<HTMLDivElement> {
    const nodes = this.dragHandlesContainer == null
      ? null
      : this.dragHandlesContainer.querySelectorAll(`.${ResizableConstants.classes.handle}`);

    return nodes
      ? Array.prototype.slice.call(nodes).filter((el) => { return el.nodeName === 'DIV' })
      : new Array<HTMLDivElement>();
  }

  restoreColumnWidths() {
    if (!this.options.store)
      return;

    const tableId = ResizableTableColumns.generateTableId(this.table);
    if (tableId.length === 0)
      return;

    const data = this.options.store.get(tableId);
    if (!data)
      return;

    this.getResizableHeaders()
      .forEach((el, idx) => {
        const width = data.columns[ResizableTableColumns.generateColumnId(el)]
        if (typeof width !== 'undefined') {
          ResizableTableColumns.setWidth(el, width);
        }
      });

    if (typeof data.table !== 'undefined') {
      ResizableTableColumns.setWidth(this.table, data.table);
    }
  }

  checkTableWidth() {
    let wrappperWidth = UtilitiesDOM.getWidth(this.wrapper);

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
          const width = ResizableTableColumns.getWidth(el);
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
    const tableWidth = UtilitiesDOM.getWidth(this.table);
    ResizableTableColumns.setWidth(this.dragHandlesContainer, tableWidth);
    this.dragHandlesContainer.style.minWidth = `${tableWidth}px`;

    const headers = this.getResizableHeaders();
    this.getDragHandlers()
      .forEach((el, idx) => {
        const height = UtilitiesDOM.getInnerHeight(this.options.resizeFromBody ? this.table : this.table.tHead);

        if (idx < headers.length) {
          const th = headers[idx];
          let left = UtilitiesDOM.getOuterWidth(th);
          left += UtilitiesDOM.getOffset(th).left;
          left -= UtilitiesDOM.getOffset(this.dragHandlesContainer).left;
          el.style.left = `${left}px`;
          el.style.height = `${height}px`;
        }
      });
  }

  getResizableHeaders(): HTMLTableCellElement[] {
    return this.tableHeaders
      .filter((el, idx) => {
        return el.hasAttribute(ResizableConstants.attibutes.dataResizable);
      });
  }

  handlePointerDown(event: Event): void {
    this.handlePointerUp();

    const target = event ? event.target as HTMLElement : null;
    if (target == null)
      return;

    if (target.nodeName !== 'DIV' || !UtilitiesDOM.hasClass(target, ResizableConstants.classes.handle))
      return;

    if (typeof (<any>event).button === 'number' && (<any>event).button !== 0)
      return; // this is not a left click

    const dragHandler = <HTMLDivElement>target;
    const gripIndex = this.getDragHandlers().indexOf(dragHandler);
    const resizableHeaders = this.getResizableHeaders();
    if (gripIndex >= resizableHeaders.length)
      return;

    const millisecondsNow = (new Date()).getTime();
    const isDoubleClick = (millisecondsNow - this.lastPointerDown) < this.options.doubleClickDelay;
    const column = resizableHeaders[gripIndex];
    const columnWidth = ResizableTableColumns.getWidth(column);
    const tableWidth = ResizableTableColumns.getWidth(this.table);

    const eventData: ResizableEventData = new ResizableEventData();
    eventData.column = column;
    eventData.dragHandler = dragHandler;
    eventData.pointer = {
      x: UtilitiesDOM.getPointerX(event),
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
    if (!this.eventData || !event)
      return;

    const difference = UtilitiesDOM.getPointerX(event) - this.eventData.pointer.x;
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

  handlePointerUp(): void {
    this.detachHandlers();

    if (!this.eventData)
      return;

    if (this.eventData.pointer.isDoubleClick) {
      this.handleDoubleClick()
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

  handleDoubleClick(): void {
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

  attachHandlers(): void {
    ResizableConstants.events.pointerMove
      .forEach((evt, evtIdx) => {
        this.ownerDocument.addEventListener(evt, this.onPointerMoveRef, false);
      });

    ResizableConstants.events.pointerUp
      .forEach((evt, evtIdx) => {
        this.ownerDocument.addEventListener(evt, this.onPointerUpRef, false);
      });
  }

  detachHandlers(): void {
    ResizableConstants.events.pointerMove
      .forEach((evt, evtIdx) => {
        this.ownerDocument.removeEventListener(evt, this.onPointerMoveRef, false);
      });

    ResizableConstants.events.pointerUp
      .forEach((evt, evtIdx) => {
        this.ownerDocument.removeEventListener(evt, this.onPointerUpRef, false);
      });
  }

  refreshWrapperStyle(): void {
    if (this.wrapper == null)
      return;

    const original = this.wrapper.style.overflowX;
    this.wrapper.style.overflowX = 'hidden';
    this.wrapper.style.overflowX = original;
  }

  saveColumnWidths() {
    if (!this.options.store)
      return;

    const tableId = ResizableTableColumns.generateTableId(this.table);
    if (tableId.length === 0)
      return;

    const data = {
      table: ResizableTableColumns.getWidth(this.table),
      columns: {}
    };
    this.getResizableHeaders()
      .forEach((el, idx) => {
        data.columns[ResizableTableColumns.generateColumnId(el)] = ResizableTableColumns.getWidth(el);
      });
    this.options.store.set(tableId, data);
  }

  createHandlerReferences() {
    if (!this.onPointerDownRef) {
      this.onPointerDownRef = (evt) => {
        this.handlePointerDown(evt);
      };
    }

    if (!this.onPointerMoveRef) {
      this.onPointerMoveRef = (evt) => {
        this.handlePointerMove(evt);
      };
    }

    if (!this.onPointerUpRef) {
      this.onPointerUpRef = (evt) => {
        this.handlePointerUp();
      };
    }
  }

  registerWindowResizeHandler(): void {
    const win = this.ownerDocument.defaultView;
    if (ResizableTableColumns.windowResizeHandlerRegistered)
      return;

    ResizableTableColumns.windowResizeHandlerRegistered = true;
    ResizableConstants.events.windowResize
      .forEach((evt, idx) => {
        win.addEventListener(evt, ResizableTableColumns.onWindowResize, false);
      });
  }

  handleWindowResize(): void {
    this.checkTableWidth();
    this.syncHandleWidths();
  }

  static onWindowResize(event: Event): void {
    const target = event ? event.target as Window : null;
    if (target == null)
      return;

    const tables = target.document.querySelectorAll(`.${ResizableConstants.classes.table}`);
    for (let index = 0; index < tables.length; index++) {
      const table = tables[index];
      if (typeof table[ResizableConstants.dataPropertyname] !== 'object')
        continue;

      table[ResizableConstants.dataPropertyname].handleWindowResize();
    }
  }

  static generateColumnId(el: HTMLElement): string {
    const columnId = (el.getAttribute(ResizableConstants.attibutes.dataResizable) || '')
      .trim()
      .replace(/\./g, '_');

    return columnId;
  }

  static generateTableId(table: HTMLTableElement): string {
    const tableId = (table.getAttribute(ResizableConstants.attibutes.dataResizableTable) || '')
      .trim()
      .replace(/\./g, '_');

    return tableId.length
      ? `rtc/${tableId}`
      : tableId;
  }

  static getWidth(el: HTMLElement): number {
    if (el.style.width === '')
      return UtilitiesDOM.getWidth(el);

    return <number>Utilities.parseStyleDimension(el.style.width, false);
  }

  static setWidth(element: HTMLElement, width: number) {
    let strWidth = width.toFixed(2);
    strWidth = width > 0 ? strWidth : '0';
    element.style.width = `${strWidth}px`;
  }

  static getInstanceId(): number {
    return ResizableTableColumns.instancesCount++;
  }
}

export default ResizableTableColumns;
