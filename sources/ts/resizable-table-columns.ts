import { ResizableConstants } from "./resizable-constants";
import { ResizableEventData, type ResizableEventDetail } from "./resizable-event-data";
import { type IStoredWidths, ResizableOptions } from "./resizable-options";

interface IHeaderDetails<T> {
  el: HTMLElement;
  detail: T;
}

const getAttachedInstance = (el: Element): unknown =>
  (el as unknown as Record<string, unknown>)[ResizableConstants.dataPropertyName];

const setAttachedInstance = (el: Element, value: unknown): void => {
  (el as unknown as Record<string, unknown>)[ResizableConstants.dataPropertyName] = value;
};

const childrenByName = (parent: Element, nodeName: string): Element[] =>
  Array.from(parent.children).filter((child) => child.nodeName === nodeName);

const isResizable = (el: Element): boolean => el.hasAttribute(ResizableConstants.attributes.dataResizable);

export class ResizableTableColumns {
  static instancesCount: number = 0;
  static windowResizeHandlerRef: EventListener | null = null;

  table: HTMLTableElement;
  options: ResizableOptions;

  id: number;
  wrapper: HTMLDivElement | null;
  ownerDocument: Document;
  tableHeaders: HTMLTableHeaderCellElement[];
  dragHandlesContainer: HTMLDivElement | null;
  originalWidths: IHeaderDetails<string>[];
  eventData: ResizableEventData | null;
  lastPointerDown: number;
  onPointerDownRef!: EventListener | null;
  onPointerMoveRef!: EventListener | null;
  onPointerUpRef!: EventListener | null;

  constructor(table: HTMLTableElement, options: Partial<ResizableOptions> | null = null) {
    if (
      typeof table !== "object" ||
      table === null ||
      Object.prototype.toString.call(table) !== "[object HTMLTableElement]"
    )
      throw new Error(
        'Invalid argument: "table".\nResizableTableColumns requires that the table element is a not null HTMLTableElement object!',
      );

    if (typeof getAttachedInstance(table) !== "undefined")
      throw new Error(
        `Existing "${ResizableConstants.dataPropertyName}" property.\nTable element already has a '${ResizableConstants.dataPropertyName}' attached object!`,
      );

    this.id = ResizableTableColumns.getInstanceId();
    this.table = table;
    this.options = new ResizableOptions(options, table);

    this.wrapper = null;
    this.ownerDocument = table.ownerDocument;
    this.tableHeaders = [];
    this.dragHandlesContainer = null;
    this.originalWidths = [];
    this.eventData = null;
    this.lastPointerDown = 0;

    this.init();

    setAttachedInstance(this.table, this);
  }

  init() {
    this.validateMarkup();
    this.createHandlerReferences();
    this.wrapTable();
    this.assignTableHeaders();
    this.storeOriginalWidths();
    this.setHeaderWidths();
    this.createDragHandles();
    this.restoreColumnWidths();
    this.checkTableWidth();
    this.syncHandleWidths();
    this.registerWindowResizeHandler();
  }

  dispose() {
    this.detachHandlers();
    this.destroyDragHandles();
    this.restoreOriginalWidths();
    this.unwrapTable();
    this.tableHeaders = [];
    this.originalWidths = [];
    this.eventData = null;
    this.onPointerDownRef = null;
    this.onPointerMoveRef = null;
    this.onPointerUpRef = null;
    setAttachedInstance(this.table, undefined);
  }

  validateMarkup(): void {
    const theads = childrenByName(this.table, "THEAD");
    const theadCount = theads.length;
    const tbodyCount = childrenByName(this.table, "TBODY").length;
    const thead = theads[0];

    if (thead === undefined || theadCount !== 1)
      throw new Error(
        `Markup validation: thead count.\nResizableTableColumns requires that the table element has one(1) table head element. Current count: ${theadCount}`,
      );

    if (tbodyCount !== 1)
      throw new Error(
        `Markup validation: tbody count.\nResizableTableColumns requires that the table element has one(1) table body element. Current count: ${tbodyCount}`,
      );

    const theadRows = childrenByName(thead, "TR");
    const theadRowCount = theadRows.length;
    const firstRow = theadRows[0];

    if (firstRow === undefined)
      throw new Error(
        `Markup validation: thead row count.\nResizableTableColumns requires that the table head element has at least one(1) table row element. Current count: ${theadRowCount}`,
      );

    const headerCellsCount = childrenByName(firstRow, "TH").length;
    const invalidHeaderCellsCount = childrenByName(firstRow, "TD").length;

    if (headerCellsCount < 1)
      throw new Error(
        `Markup validation: thead first row cells count.\nResizableTableColumns requires that the table head's first row element has at least one(1) table header cell element. Current count: ${headerCellsCount}`,
      );

    if (invalidHeaderCellsCount !== 0)
      throw new Error(
        `Markup validation: thead first row invalid.\nResizableTableColumns requires that the table head's first row element has no(0) table cell(TD) elements. Current count: ${invalidHeaderCellsCount}`,
      );
  }

  wrapTable() {
    if (this.wrapper) return;

    this.wrapper = this.ownerDocument.createElement("div");
    this.wrapper.classList.add(ResizableConstants.classes.wrapper);

    this.table.before(this.wrapper);
    this.wrapper.append(this.table);
    this.table.classList.add(ResizableConstants.classes.table);
  }

  unwrapTable() {
    this.table.classList.remove(ResizableConstants.classes.table);
    if (!this.wrapper) return;

    this.wrapper.replaceWith(this.table);
    this.wrapper = null;
  }

  assignTableHeaders() {
    const tableHeader = childrenByName(this.table, "THEAD")[0];
    if (!tableHeader) return;

    const firstTableRow = childrenByName(tableHeader, "TR")[0];
    if (!firstTableRow) return;

    this.tableHeaders.push(...(childrenByName(firstTableRow, "TH") as HTMLTableHeaderCellElement[]));
  }

  storeOriginalWidths() {
    for (const el of this.tableHeaders) {
      this.originalWidths.push({ el, detail: el.style.width });
    }
    this.originalWidths.push({ el: this.table, detail: this.table.style.width });
  }

  restoreOriginalWidths() {
    for (const itm of this.originalWidths) {
      itm.el.style.width = itm.detail;
    }
  }

  setHeaderWidths() {
    for (const el of this.tableHeaders) {
      let constrainedWidth = this.constrainWidth(el, el.offsetWidth);
      if (typeof this.options.maxInitialWidthHint === "number") {
        constrainedWidth = Math.min(constrainedWidth, this.options.maxInitialWidthHint);
      }
      this.updateWidth(el, constrainedWidth, true, false);
    }
  }

  constrainWidth(_el: HTMLElement, width: number): number {
    let result: number = width;
    result = Math.max(result, this.options.minWidth || -Infinity);
    result = Math.min(result, this.options.maxWidth || +Infinity);
    return result;
  }

  createDragHandles() {
    if (this.dragHandlesContainer != null)
      throw new Error("Drag handlers already created. Call <destroyDragHandles> if you wish to recreate them");

    const container = this.ownerDocument.createElement("div");
    this.dragHandlesContainer = container;
    this.wrapper?.insertBefore(container, this.table);
    container.classList.add(ResizableConstants.classes.handleContainer);

    for (const _ of this.getResizableHeaders()) {
      const handler = this.ownerDocument.createElement("div");
      handler.classList.add(ResizableConstants.classes.handle);
      container.append(handler);
    }

    for (const evt of ResizableConstants.events.pointerDown) {
      container.addEventListener(evt, this.onPointerDownRef as EventListener, false);
    }
  }

  destroyDragHandles() {
    const container = this.dragHandlesContainer;
    if (container === null) return;

    for (const evt of ResizableConstants.events.pointerDown) {
      container.removeEventListener(evt, this.onPointerDownRef as EventListener, false);
    }
    container.remove();
    this.dragHandlesContainer = null;
  }

  getDragHandlers(): Array<HTMLDivElement> {
    if (this.dragHandlesContainer == null) return [];

    return Array.from(
      this.dragHandlesContainer.querySelectorAll<HTMLDivElement>(`.${ResizableConstants.classes.handle}`),
    ).filter((el) => el.nodeName === "DIV");
  }

  restoreColumnWidths() {
    if (!this.options.store) return;

    const tableId = ResizableTableColumns.generateTableId(this.table);
    if (tableId.length === 0) return;

    const data = this.options.store.get(tableId) as IStoredWidths | undefined;
    if (!data) return;

    for (const el of this.getResizableHeaders()) {
      const width = data.columns[ResizableTableColumns.generateColumnId(el)];
      if (typeof width !== "undefined") {
        ResizableTableColumns.setWidth(el, width);
      }
    }

    if (typeof data.table !== "undefined") {
      ResizableTableColumns.setWidth(this.table, data.table);
    }
  }

  checkTableWidth() {
    const wrapperWidth = (this.wrapper as HTMLElement).clientWidth;
    const tableWidth = this.table.offsetWidth;
    const difference = wrapperWidth - tableWidth;
    if (difference <= 0) return;

    let addedWidth = 0;
    const headersDetails: IHeaderDetails<number>[] = this.tableHeaders
      .filter(isResizable)
      .map((el) => ({ el, detail: el.offsetWidth }));
    const resizableWidth = headersDetails.reduce((sum, d) => sum + d.detail, 0);

    let leftToAdd = 0;
    // The last cell written and its new width. Widths are tracked here instead of re-read from the DOM,
    // because offsetWidth is unreliable while the column widths and the table width disagree.
    let lastResized: IHeaderDetails<number> | null = null;

    let currentDetail = headersDetails.shift();
    while (currentDetail) {
      leftToAdd = difference - addedWidth;

      let extraWidth = Math.floor((currentDetail.detail / resizableWidth) * difference);
      extraWidth = Math.min(extraWidth, leftToAdd);
      const newWidth = this.updateWidth(currentDetail.el, currentDetail.detail + extraWidth, false, true);
      addedWidth += newWidth - currentDetail.detail;
      lastResized = { el: currentDetail.el, detail: newWidth };

      if (addedWidth >= difference) break;
      currentDetail = headersDetails.shift();
    }

    leftToAdd = difference - addedWidth;
    if (leftToAdd > 0) {
      // Give the remainder that min/max clamping kept from being distributed to a single cell, so the column
      // widths add up to the table width; otherwise the browser spreads it over every column.
      const fallback = this.tableHeaders.at(-1);
      const target =
        headersDetails[0] ?? lastResized ?? (fallback ? { el: fallback, detail: fallback.offsetWidth } : null);
      if (target) {
        this.updateWidth(target.el, target.detail + leftToAdd, true, true);
      }
    }
    ResizableTableColumns.setWidth(this.table, wrapperWidth);
  }

  syncHandleWidths() {
    const container = this.dragHandlesContainer as HTMLDivElement;
    const tableWidth = this.table.clientWidth;
    ResizableTableColumns.setWidth(container, tableWidth);
    container.style.minWidth = `${tableWidth}px`;

    const headers = this.getResizableHeaders();
    const height = ((this.options.resizeFromBody ? this.table : this.table.tHead) as HTMLElement).clientHeight;
    const containerLeft = ResizableTableColumns.getOffset(container).left;

    this.getDragHandlers().forEach((el, idx) => {
      const th = headers[idx];
      if (!th) return;

      const left = th.offsetWidth + ResizableTableColumns.getOffset(th).left - containerLeft;
      el.style.left = `${left}px`;
      el.style.height = `${height}px`;
    });
  }

  getResizableHeaders(): HTMLTableCellElement[] {
    return this.tableHeaders.filter(isResizable);
  }

  handlePointerDown(event: Event): void {
    this.handlePointerUp();

    const target = event ? (event.target as HTMLElement | null) : null;
    if (target == null) return;

    if (target.nodeName !== "DIV" || !target.classList.contains(ResizableConstants.classes.handle)) return;

    if (typeof (event as MouseEvent).button === "number" && (event as MouseEvent).button !== 0) return; // this is not a left click

    const dragHandler = target as HTMLDivElement;
    const gripIndex = this.getDragHandlers().indexOf(dragHandler);
    const column = this.getResizableHeaders()[gripIndex];
    if (!column) return;

    const millisecondsNow = Date.now();
    const isDoubleClick = millisecondsNow - this.lastPointerDown < this.options.doubleClickDelay;
    const columnWidth = column.offsetWidth;

    const widths = {
      column: columnWidth,
      table: this.table.offsetWidth,
    };
    const eventData = new ResizableEventData(column, dragHandler);
    eventData.pointer = {
      x: ResizableTableColumns.getPointerX(event),
      isDoubleClick,
    };
    eventData.originalWidths = widths;
    eventData.newWidths = widths;

    this.detachHandlers(); //make sure we do not have extra handlers
    this.attachHandlers();

    const pointerId = (event as PointerEvent).pointerId;
    if (typeof pointerId === "number" && typeof dragHandler.setPointerCapture === "function") {
      try {
        dragHandler.setPointerCapture(pointerId);
      } catch {
        // the pointer may no longer be active; capture is a best effort
      }
    }

    this.table.classList.add(ResizableConstants.classes.tableResizing);
    this.wrapper?.classList.add(ResizableConstants.classes.tableResizing);
    dragHandler.classList.add(ResizableConstants.classes.columnResizing);
    column.classList.add(ResizableConstants.classes.columnResizing);

    this.lastPointerDown = millisecondsNow;
    this.eventData = eventData;

    this.dispatchResizeEvent(ResizableConstants.events.eventResizeStart, column, columnWidth, this.table.clientWidth);
    event.preventDefault();
  }

  handlePointerMove(event: Event): void {
    if (!this.eventData || !event) return;

    const difference = (ResizableTableColumns.getPointerX(event) || 0) - (this.eventData.pointer.x || 0);
    if (difference === 0) return;

    this.applyColumnDelta(difference);
  }

  handlePointerUp(): void {
    this.detachHandlers();

    if (!this.eventData) return;

    if (this.eventData.pointer.isDoubleClick) {
      this.handleDoubleClick();
    }

    this.table.classList.remove(ResizableConstants.classes.tableResizing);
    this.wrapper?.classList.remove(ResizableConstants.classes.tableResizing);
    this.eventData.dragHandler.classList.remove(ResizableConstants.classes.columnResizing);
    this.eventData.column.classList.remove(ResizableConstants.classes.columnResizing);

    this.checkTableWidth();
    this.syncHandleWidths();
    this.refreshWrapperStyle();
    this.saveColumnWidths();

    const widths = this.eventData.newWidths || this.eventData.originalWidths;
    this.dispatchResizeEvent(
      ResizableConstants.events.eventResizeStop,
      this.eventData.column,
      widths.column,
      widths.table,
    );

    this.eventData = null;
  }

  handleDoubleClick(): void {
    if (!this.eventData?.column) return;

    const column = this.eventData.column;
    const colIndex = this.tableHeaders.indexOf(column);

    let maxWidth = 0;
    const indicesToSkip: number[] = [];
    this.tableHeaders.forEach((el, idx) => {
      if (!isResizable(el)) {
        indicesToSkip.push(idx);
      }
    });

    const span = this.ownerDocument.createElement("span");
    Object.assign(span.style, { position: "absolute", left: "-99999px", top: "-99999px", visibility: "hidden" });
    this.ownerDocument.body.append(span);

    for (const row of Array.from(this.table.querySelectorAll("tr"))) {
      const cells = Array.from(row.querySelectorAll<HTMLElement>("td, th"));
      let currentIndex = 0;

      for (const [cellIndex, cell] of cells.entries()) {
        const parsed = Number.parseInt(cell.getAttribute("colspan") ?? "1", 10);
        const colSpan = Number.isNaN(parsed) ? 1 : parsed;

        if (!indicesToSkip.includes(cellIndex) && colSpan === 1 && currentIndex === colIndex) {
          maxWidth = Math.max(maxWidth, ResizableTableColumns.getTextWidth(cell, span));
          break;
        }

        currentIndex += colSpan;
      }
    }

    span.remove();

    const difference = maxWidth - column.offsetWidth;
    if (difference === 0) return;

    this.applyColumnDelta(difference);

    this.checkTableWidth();
    this.syncHandleWidths();
    this.saveColumnWidths();
  }

  attachHandlers(): void {
    for (const evt of ResizableConstants.events.pointerMove) {
      this.ownerDocument.addEventListener(evt, this.onPointerMoveRef as EventListener, false);
    }

    for (const evt of ResizableConstants.events.pointerUp) {
      this.ownerDocument.addEventListener(evt, this.onPointerUpRef as EventListener, false);
    }
  }

  detachHandlers(): void {
    for (const evt of ResizableConstants.events.pointerMove) {
      this.ownerDocument.removeEventListener(evt, this.onPointerMoveRef as EventListener, false);
    }

    for (const evt of ResizableConstants.events.pointerUp) {
      this.ownerDocument.removeEventListener(evt, this.onPointerUpRef as EventListener, false);
    }
  }

  refreshWrapperStyle(): void {
    if (this.wrapper == null) return;

    const original = this.wrapper.style.overflowX;
    this.wrapper.style.overflowX = "hidden";
    this.wrapper.style.overflowX = original;
  }

  saveColumnWidths() {
    if (!this.options.store) return;

    const tableId = ResizableTableColumns.generateTableId(this.table);
    if (tableId.length === 0) return;

    const data: IStoredWidths = {
      table: this.table.offsetWidth,
      columns: {},
    };
    for (const el of this.getResizableHeaders()) {
      data.columns[ResizableTableColumns.generateColumnId(el)] = el.offsetWidth;
    }
    this.options.store.set(tableId, data);
  }

  createHandlerReferences() {
    this.onPointerDownRef ??= ResizableTableColumns.debounce((evt) => this.handlePointerDown(evt), 100, true);
    this.onPointerMoveRef ??= ResizableTableColumns.debounce((evt) => this.handlePointerMove(evt), 5, false);
    this.onPointerUpRef ??= ResizableTableColumns.debounce(() => this.handlePointerUp(), 100, true);
  }

  registerWindowResizeHandler(): void {
    if (ResizableTableColumns.windowResizeHandlerRef) return;

    const win = this.ownerDocument.defaultView;
    const handler = ResizableTableColumns.debounce(ResizableTableColumns.onWindowResize, 50, false);
    ResizableTableColumns.windowResizeHandlerRef = handler;
    for (const evt of ResizableConstants.events.windowResize) {
      win?.addEventListener(evt, handler, false);
    }
  }

  handleWindowResize(): void {
    this.checkTableWidth();
    this.syncHandleWidths();
    this.saveColumnWidths();
  }

  updateWidth(
    cell: HTMLElement,
    suggestedWidth: number,
    skipConstrainCheck: boolean,
    skipTableResize: boolean,
  ): number {
    const originalCellWidth = cell.offsetWidth;
    const columnWidth = skipConstrainCheck ? suggestedWidth : this.constrainWidth(cell, suggestedWidth);

    ResizableTableColumns.setWidth(cell, columnWidth);
    if (!skipTableResize) {
      const difference = columnWidth - originalCellWidth;
      ResizableTableColumns.setWidth(this.table, this.table.offsetWidth + difference);
    }

    return columnWidth;
  }

  /** Resize the column being dragged by `difference` pixels relative to its original width and notify listeners. */
  private applyColumnDelta(difference: number): void {
    const eventData = this.eventData;
    if (!eventData) return;

    const columnWidth = this.constrainWidth(eventData.column, eventData.originalWidths.column + difference);
    // Grow/shrink the table by what the column actually changed (after min/max clamping), not by the raw
    // pointer delta; otherwise the browser spreads the excess over all columns and maxWidth is not honoured.
    const tableWidth = eventData.originalWidths.table + (columnWidth - eventData.originalWidths.column);
    ResizableTableColumns.setWidth(this.table, tableWidth);
    ResizableTableColumns.setWidth(eventData.column, columnWidth);

    eventData.newWidths = { column: columnWidth, table: tableWidth };
    this.dispatchResizeEvent(ResizableConstants.events.eventResize, eventData.column, columnWidth, tableWidth);
  }

  private dispatchResizeEvent(
    name: string,
    column: HTMLTableCellElement,
    columnWidth: number,
    tableWidth: number,
  ): void {
    this.table.dispatchEvent(
      new CustomEvent<ResizableEventDetail>(name, {
        detail: { column, columnWidth, table: this.table, tableWidth },
      }),
    );
  }

  static onWindowResize(event: Event): void {
    const win = event ? (event.target as Window | null) : null;
    if (win == null) return;

    for (const table of Array.from(win.document.querySelectorAll(`.${ResizableConstants.classes.table}`))) {
      const instance = getAttachedInstance(table);
      if (typeof instance !== "object" || instance === null) continue;

      (instance as ResizableTableColumns).handleWindowResize();
    }
  }

  static generateColumnId(el: HTMLElement): string {
    return (el.getAttribute(ResizableConstants.attributes.dataResizable) ?? "").trim().replaceAll(".", "_");
  }

  static generateTableId(table: HTMLTableElement): string {
    const tableId = (table.getAttribute(ResizableConstants.attributes.dataResizableTable) ?? "")
      .trim()
      .replaceAll(".", "_");

    return tableId.length ? `rtc/${tableId}` : tableId;
  }

  static setWidth(element: HTMLElement, width: number) {
    const strWidth = width > 0 ? width.toFixed(2) : "0";
    element.style.width = `${strWidth}px`;
  }

  static getInstanceId(): number {
    return ResizableTableColumns.instancesCount++;
  }

  static debounce = (func: (event: Event) => void, wait: number, immediate: boolean): ((event: Event) => void) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (event: Event) => {
      const callNow = immediate && !timeout;
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        timeout = null;
        if (!immediate) {
          func(event);
        }
      }, wait);
      if (callNow) {
        func(event);
      }
    };
  };

  static getPointerX(event: Event): number | null {
    if (event.type.startsWith("touch")) {
      const tEvent = event as TouchEvent;
      const touch = tEvent.touches?.[0] ?? tEvent.changedTouches?.[0];
      if (touch) return touch.pageX;
    }
    return (event as MouseEvent).pageX;
  }

  static getTextWidth(contentElement: HTMLElement, measurementElement: HTMLElement): number {
    if (!contentElement || !measurementElement) return 0;

    // Non-breaking spaces keep the text on one line; the trailing one ensures we do not get the `...`.
    // Assign via textContent so cell text is never parsed as HTML.
    const text = `${(contentElement.textContent ?? "").trim().replace(/\s/g, " ")} `;

    const styles = contentElement.ownerDocument.defaultView?.getComputedStyle(contentElement);
    if (styles) {
      for (const prop of ["fontFamily", "fontSize", "fontWeight", "padding", "border", "boxSizing"] as const) {
        measurementElement.style[prop] = styles[prop];
      }
    }

    measurementElement.textContent = text;
    return measurementElement.offsetWidth;
  }

  static getOffset(el: HTMLElement): { top: number; left: number } {
    if (!el) return { top: 0, left: 0 };

    const rect = el.getBoundingClientRect();
    const win = el.ownerDocument.defaultView;

    return {
      top: rect.top + (win?.scrollY ?? 0),
      left: rect.left + (win?.scrollX ?? 0),
    };
  }
}
