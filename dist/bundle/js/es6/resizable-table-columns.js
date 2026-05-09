import { ResizableConstants } from "./resizable-constants";
import { ResizableEventData } from "./resizable-event-data";
import { ResizableOptions } from "./resizable-options";
export class ResizableTableColumns {
    static instancesCount = 0;
    static windowResizeHandlerRef = null;
    table;
    options;
    id;
    wrapper;
    ownerDocument;
    tableHeaders;
    dragHandlesContainer;
    originalWidths;
    eventData;
    lastPointerDown;
    onPointerDownRef;
    onPointerMoveRef;
    onPointerUpRef;
    constructor(table, options) {
        if (typeof table !== "object" || table === null || table.toString() !== "[object HTMLTableElement]")
            throw 'Invalid argument: "table".\nResizableTableColumns requires that the table element is a not null HTMLTableElement object!';
        if (typeof table[ResizableConstants.dataPropertyName] !== "undefined")
            throw `Existing "${ResizableConstants.dataPropertyName}" property.\nTable element already has a '${ResizableConstants.dataPropertyName}' attached object!`;
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
        this.table[ResizableConstants.dataPropertyName] = this;
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
        this.destroyDragHandles();
        this.restoreOriginalWidths();
        this.unwrapTable();
        this.onPointerDownRef = null;
        this.onPointerMoveRef = null;
        this.onPointerUpRef = null;
        this.table[ResizableConstants.dataPropertyName] = void 0;
    }
    validateMarkup() {
        let theadCount = 0;
        let tbodyCount = 0;
        let thead = null;
        for (let index = 0; index < this.table.childNodes.length; index++) {
            const element = this.table.childNodes[index];
            if (element.nodeName === "THEAD") {
                theadCount++;
                thead = element;
            }
            else if (element.nodeName === "TBODY") {
                tbodyCount++;
            }
        }
        if (thead === null || theadCount !== 1)
            throw `Markup validation: thead count.\nResizableTableColumns requires that the table element has one(1) table head element. Current count: ${theadCount}`;
        if (tbodyCount !== 1)
            throw `Markup validation: tbody count.\nResizableTableColumns requires that the table element has one(1) table body element. Current count: ${tbodyCount}`;
        let theadRowCount = 0;
        let firstRow = null;
        for (let index = 0; index < thead.childNodes.length; index++) {
            const element = thead.childNodes[index];
            if (element.nodeName === "TR") {
                theadRowCount++;
                if (firstRow === null) {
                    firstRow = element;
                }
            }
        }
        if (firstRow === null || theadRowCount < 1)
            throw `Markup validation: thead row count.\nResizableTableColumns requires that the table head element has at least one(1) table row element. Current count: ${theadRowCount}`;
        let headerCellsCount = 0;
        let invalidHeaderCellsCount = 0;
        for (let index = 0; index < firstRow.childNodes.length; index++) {
            const element = firstRow.childNodes[index];
            if (element.nodeName === "TH") {
                headerCellsCount++;
            }
            else if (element.nodeName === "TD") {
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
        this.wrapper = this.ownerDocument.createElement("div");
        this.wrapper.classList.add(ResizableConstants.classes.wrapper);
        const tableOriginalParent = this.table.parentNode;
        tableOriginalParent.insertBefore(this.wrapper, this.table);
        tableOriginalParent.removeChild(this.table);
        this.wrapper.appendChild(this.table);
        this.table.classList.add(ResizableConstants.classes.table);
    }
    unwrapTable() {
        this.table.classList.remove(ResizableConstants.classes.table);
        if (!this.wrapper)
            return;
        const tableOriginalParent = this.wrapper.parentNode;
        tableOriginalParent.insertBefore(this.table, this.wrapper);
        tableOriginalParent.removeChild(this.wrapper);
        this.wrapper = null;
    }
    assignTableHeaders() {
        let tableHeader;
        let firstTableRow;
        for (let index = 0; index < this.table.childNodes.length; index++) {
            const element = this.table.childNodes[index];
            if (element.nodeName === "THEAD") {
                tableHeader = element;
                break;
            }
        }
        if (!tableHeader)
            return;
        for (let index = 0; index < tableHeader.childNodes.length; index++) {
            const element = tableHeader.childNodes[index];
            if (element.nodeName === "TR") {
                firstTableRow = element;
                break;
            }
        }
        if (!firstTableRow)
            return;
        for (let index = 0; index < firstTableRow.childNodes.length; index++) {
            const element = firstTableRow.childNodes[index];
            if (element.nodeName === "TH") {
                this.tableHeaders.push(element);
            }
        }
    }
    storeOriginalWidths() {
        this.tableHeaders.forEach((el) => {
            this.originalWidths.push({
                el: el,
                detail: el.style.width,
            });
        });
        this.originalWidths.push({
            el: this.table,
            detail: this.table.style.width,
        });
    }
    restoreOriginalWidths() {
        this.originalWidths.forEach((itm) => {
            itm.el.style.width = itm.detail;
        });
    }
    setHeaderWidths() {
        this.tableHeaders.forEach((el) => {
            const width = el.offsetWidth;
            let constrainedWidth = this.constrainWidth(el, width);
            if (typeof this.options.maxInitialWidthHint === "number") {
                constrainedWidth = Math.min(constrainedWidth, this.options.maxInitialWidthHint);
            }
            this.updateWidth(el, constrainedWidth, true, false);
        });
    }
    constrainWidth(_el, width) {
        let result = width;
        result = Math.max(result, this.options.minWidth || -Infinity);
        result = Math.min(result, this.options.maxWidth || +Infinity);
        return result;
    }
    createDragHandles() {
        if (this.dragHandlesContainer != null)
            throw "Drag handlers already created. Call <destroyDragHandles> if you wish to recreate them";
        this.dragHandlesContainer = this.ownerDocument.createElement("div");
        this.wrapper?.insertBefore(this.dragHandlesContainer, this.table);
        this.dragHandlesContainer.classList.add(ResizableConstants.classes.handleContainer);
        this.getResizableHeaders().forEach(() => {
            const handler = this.ownerDocument.createElement("div");
            handler.classList.add(ResizableConstants.classes.handle);
            this.dragHandlesContainer?.appendChild(handler);
        });
        ResizableConstants.events.pointerDown.forEach((evt, _evtIdx) => {
            this.dragHandlesContainer?.addEventListener(evt, this.onPointerDownRef, false);
        });
    }
    destroyDragHandles() {
        if (this.dragHandlesContainer !== null) {
            ResizableConstants.events.pointerDown.forEach((evt, _evtIdx) => {
                this.dragHandlesContainer?.removeEventListener(evt, this.onPointerDownRef, false);
            });
            this.dragHandlesContainer?.parentElement?.removeChild(this.dragHandlesContainer);
        }
    }
    getDragHandlers() {
        const nodes = this.dragHandlesContainer == null
            ? null
            : this.dragHandlesContainer.querySelectorAll(`.${ResizableConstants.classes.handle}`);
        return nodes
            ? Array.prototype.slice.call(nodes).filter((el) => {
                return el.nodeName === "DIV";
            })
            : [];
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
        this.getResizableHeaders().forEach((el) => {
            const width = data.columns[ResizableTableColumns.generateColumnId(el)];
            if (typeof width !== "undefined") {
                ResizableTableColumns.setWidth(el, width);
            }
        });
        if (typeof data.table !== "undefined") {
            ResizableTableColumns.setWidth(this.table, data.table);
        }
    }
    checkTableWidth() {
        const wrapperWidth = this.wrapper.clientWidth;
        const tableWidth = this.table.offsetWidth;
        const difference = wrapperWidth - tableWidth;
        if (difference <= 0)
            return;
        let resizableWidth = 0;
        let addedWidth = 0;
        const headersDetails = [];
        this.tableHeaders.forEach((el, _idx) => {
            if (el.hasAttribute(ResizableConstants.attributes.dataResizable)) {
                const detail = {
                    el: el,
                    detail: el.offsetWidth,
                };
                headersDetails.push(detail);
                resizableWidth += detail.detail;
            }
        });
        let leftToAdd = 0;
        let lastResizableCell = null;
        let currentDetail;
        while (headersDetails.length > 0) {
            currentDetail = headersDetails.shift();
            leftToAdd = difference - addedWidth;
            lastResizableCell = currentDetail.el;
            let extraWidth = Math.floor((currentDetail.detail / resizableWidth) * difference);
            extraWidth = Math.min(extraWidth, leftToAdd);
            const newWidth = this.updateWidth(currentDetail.el, currentDetail.detail + extraWidth, false, true);
            addedWidth += newWidth - currentDetail.detail;
            if (addedWidth >= difference)
                break;
        }
        leftToAdd = difference - addedWidth;
        if (leftToAdd > 0) {
            const lastCell = headersDetails[0]?.el || lastResizableCell || this.tableHeaders[this.tableHeaders.length - 1];
            const lastCellWidth = lastCell.offsetWidth;
            this.updateWidth(lastCell, lastCellWidth, true, true);
        }
        ResizableTableColumns.setWidth(this.table, wrapperWidth);
    }
    syncHandleWidths() {
        const tableWidth = this.table.clientWidth;
        ResizableTableColumns.setWidth(this.dragHandlesContainer, tableWidth);
        this.dragHandlesContainer.style.minWidth = `${tableWidth}px`;
        const headers = this.getResizableHeaders();
        this.getDragHandlers().forEach((el, idx) => {
            const height = (this.options.resizeFromBody ? this.table : this.table.tHead).clientHeight;
            if (idx < headers.length) {
                const th = headers[idx];
                let left = th.offsetWidth;
                left += ResizableTableColumns.getOffset(th).left;
                left -= ResizableTableColumns.getOffset(this.dragHandlesContainer).left;
                el.style.left = `${left}px`;
                el.style.height = `${height}px`;
            }
        });
    }
    getResizableHeaders() {
        return this.tableHeaders.filter((el, _idx) => {
            return el.hasAttribute(ResizableConstants.attributes.dataResizable);
        });
    }
    handlePointerDown(event) {
        this.handlePointerUp();
        const target = event ? event.target : null;
        if (target == null)
            return;
        if (target.nodeName !== "DIV" || !target.classList.contains(ResizableConstants.classes.handle))
            return;
        if (typeof event.button === "number" && event.button !== 0)
            return; // this is not a left click
        const dragHandler = target;
        const gripIndex = this.getDragHandlers().indexOf(dragHandler);
        const resizableHeaders = this.getResizableHeaders();
        if (gripIndex >= resizableHeaders.length)
            return;
        const millisecondsNow = Date.now();
        const isDoubleClick = millisecondsNow - this.lastPointerDown < this.options.doubleClickDelay;
        const column = resizableHeaders[gripIndex];
        const columnWidth = column.offsetWidth;
        const widths = {
            column: columnWidth,
            table: this.table.offsetWidth,
        };
        const eventData = new ResizableEventData(column, dragHandler);
        eventData.pointer = {
            x: ResizableTableColumns.getPointerX(event),
            isDoubleClick: isDoubleClick,
        };
        eventData.originalWidths = widths;
        eventData.newWidths = widths;
        this.detachHandlers(); //make sure we do not have extra handlers
        this.attachHandlers();
        this.table.classList.add(ResizableConstants.classes.tableResizing);
        this.wrapper.classList.add(ResizableConstants.classes.tableResizing);
        dragHandler.classList.add(ResizableConstants.classes.columnResizing);
        column.classList.add(ResizableConstants.classes.columnResizing);
        this.lastPointerDown = millisecondsNow;
        this.eventData = eventData;
        var eventToDispatch = new CustomEvent(ResizableConstants.events.eventResizeStart, {
            detail: {
                column: column,
                columnWidth: columnWidth,
                table: this.table,
                tableWidth: this.table.clientWidth,
            },
        });
        this.table.dispatchEvent(eventToDispatch);
        event.preventDefault();
    }
    handlePointerMove(event) {
        if (!this.eventData || !event)
            return;
        const difference = (ResizableTableColumns.getPointerX(event) || 0) - (this.eventData.pointer.x || 0);
        if (difference === 0) {
            return;
        }
        const tableWidth = this.eventData.originalWidths.table + difference;
        const columnWidth = this.constrainWidth(this.eventData.column, this.eventData.originalWidths.column + difference);
        ResizableTableColumns.setWidth(this.table, tableWidth);
        ResizableTableColumns.setWidth(this.eventData.column, columnWidth);
        this.eventData.newWidths = {
            column: columnWidth,
            table: tableWidth,
        };
        var eventToDispatch = new CustomEvent(ResizableConstants.events.eventResize, {
            detail: {
                column: this.eventData.column,
                columnWidth: columnWidth,
                table: this.table,
                tableWidth: tableWidth,
            },
        });
        this.table.dispatchEvent(eventToDispatch);
    }
    handlePointerUp() {
        this.detachHandlers();
        if (!this.eventData)
            return;
        if (this.eventData.pointer.isDoubleClick) {
            this.handleDoubleClick();
        }
        this.table.classList.remove(ResizableConstants.classes.tableResizing);
        this.wrapper.classList.remove(ResizableConstants.classes.tableResizing);
        this.eventData.dragHandler.classList.remove(ResizableConstants.classes.columnResizing);
        this.eventData.column.classList.remove(ResizableConstants.classes.columnResizing);
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
                tableWidth: widths.table,
            },
        });
        this.table.dispatchEvent(eventToDispatch);
        this.eventData = null;
    }
    handleDoubleClick() {
        if (!this.eventData?.column)
            return;
        const column = this.eventData.column;
        const colIndex = this.tableHeaders.indexOf(column);
        let maxWidth = 0;
        const indicesToSkip = [];
        this.tableHeaders.forEach((el, idx) => {
            if (!el.hasAttribute(ResizableConstants.attributes.dataResizable)) {
                indicesToSkip.push(idx);
            }
        });
        const span = this.ownerDocument.createElement("span");
        span.style.position = "absolute";
        span.style.left = "-99999px";
        span.style.top = "-99999px";
        span.style.visibility = "hidden";
        this.ownerDocument.body.appendChild(span);
        const rows = this.table.querySelectorAll("tr");
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            const element = rows[rowIndex];
            const cells = element.querySelectorAll("td, th");
            let currentIndex = 0;
            for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                const cell = cells[cellIndex];
                let colSpan = 1;
                if (cell.hasAttribute("colspan")) {
                    const colSpanString = cell.getAttribute("colspan") || "1";
                    const parsed = parseInt(colSpanString, 10);
                    if (!Number.isNaN(parsed)) {
                        colSpan = parsed;
                    }
                    else {
                        colSpan = 1;
                    }
                }
                if (indicesToSkip.indexOf(cellIndex) === -1 && colSpan === 1 && currentIndex === colIndex) {
                    maxWidth = Math.max(maxWidth, ResizableTableColumns.getTextWidth(cell, span));
                    break;
                }
                currentIndex += colSpan;
            }
        }
        this.ownerDocument.body.removeChild(span);
        const difference = maxWidth - column.offsetWidth;
        if (difference === 0) {
            return;
        }
        const tableWidth = this.eventData.originalWidths.table + difference;
        const columnWidth = this.constrainWidth(this.eventData.column, this.eventData.originalWidths.column + difference);
        ResizableTableColumns.setWidth(this.table, tableWidth);
        ResizableTableColumns.setWidth(this.eventData.column, columnWidth);
        this.eventData.newWidths = {
            column: columnWidth,
            table: tableWidth,
        };
        var eventToDispatch = new CustomEvent(ResizableConstants.events.eventResize, {
            detail: {
                column: this.eventData.column,
                columnWidth: columnWidth,
                table: this.table,
                tableWidth: tableWidth,
            },
        });
        this.table.dispatchEvent(eventToDispatch);
        this.checkTableWidth();
        this.syncHandleWidths();
        this.saveColumnWidths();
    }
    attachHandlers() {
        ResizableConstants.events.pointerMove.forEach((evt, _evtIdx) => {
            this.ownerDocument.addEventListener(evt, this.onPointerMoveRef, false);
        });
        ResizableConstants.events.pointerUp.forEach((evt, _evtIdx) => {
            this.ownerDocument.addEventListener(evt, this.onPointerUpRef, false);
        });
    }
    detachHandlers() {
        ResizableConstants.events.pointerMove.forEach((evt, _evtIdx) => {
            this.ownerDocument.removeEventListener(evt, this.onPointerMoveRef, false);
        });
        ResizableConstants.events.pointerUp.forEach((evt, _evtIdx) => {
            this.ownerDocument.removeEventListener(evt, this.onPointerUpRef, false);
        });
    }
    refreshWrapperStyle() {
        if (this.wrapper == null)
            return;
        const original = this.wrapper.style.overflowX;
        this.wrapper.style.overflowX = "hidden";
        this.wrapper.style.overflowX = original;
    }
    saveColumnWidths() {
        if (!this.options.store)
            return;
        const tableId = ResizableTableColumns.generateTableId(this.table);
        if (tableId.length === 0)
            return;
        const data = {
            table: this.table.offsetWidth,
            columns: {},
        };
        this.getResizableHeaders().forEach((el) => {
            data.columns[ResizableTableColumns.generateColumnId(el)] = el.offsetWidth;
        });
        this.options.store.set(tableId, data);
    }
    createHandlerReferences() {
        if (!this.onPointerDownRef) {
            this.onPointerDownRef = ResizableTableColumns.debounce((evt) => {
                this.handlePointerDown(evt);
            }, 100, true);
        }
        if (!this.onPointerMoveRef) {
            this.onPointerMoveRef = ResizableTableColumns.debounce((evt) => {
                this.handlePointerMove(evt);
            }, 5, false);
        }
        if (!this.onPointerUpRef) {
            this.onPointerUpRef = ResizableTableColumns.debounce((_evt) => {
                this.handlePointerUp();
            }, 100, true);
        }
    }
    registerWindowResizeHandler() {
        const win = this.ownerDocument.defaultView;
        if (ResizableTableColumns.windowResizeHandlerRef)
            return;
        ResizableTableColumns.windowResizeHandlerRef = ResizableTableColumns.debounce(ResizableTableColumns.onWindowResize, 50, false);
        ResizableConstants.events.windowResize.forEach((evt, _idx) => {
            win?.addEventListener(evt, ResizableTableColumns.windowResizeHandlerRef, false);
        });
    }
    handleWindowResize() {
        this.checkTableWidth();
        this.syncHandleWidths();
        this.saveColumnWidths();
    }
    updateWidth(cell, suggestedWidth, skipConstrainCheck, skipTableResize) {
        const originalCellWidth = cell.offsetWidth;
        const columnWidth = skipConstrainCheck ? suggestedWidth : this.constrainWidth(cell, suggestedWidth);
        ResizableTableColumns.setWidth(cell, columnWidth);
        if (!skipTableResize) {
            const difference = columnWidth - originalCellWidth;
            const tableWidth = this.table.offsetWidth + difference;
            ResizableTableColumns.setWidth(this.table, tableWidth);
        }
        return columnWidth;
    }
    static onWindowResize(event) {
        const win = event ? event.target : null;
        if (win == null)
            return;
        const tables = win.document.querySelectorAll(`.${ResizableConstants.classes.table}`);
        for (let index = 0; index < tables.length; index++) {
            const table = tables[index];
            if (typeof table[ResizableConstants.dataPropertyName] !== "object")
                continue;
            table[ResizableConstants.dataPropertyName].handleWindowResize();
        }
    }
    static generateColumnId(el) {
        const columnId = (el.getAttribute(ResizableConstants.attributes.dataResizable) || "").trim().replace(/\./g, "_");
        return columnId;
    }
    static generateTableId(table) {
        const tableId = (table.getAttribute(ResizableConstants.attributes.dataResizableTable) || "")
            .trim()
            .replace(/\./g, "_");
        return tableId.length ? `rtc/${tableId}` : tableId;
    }
    static setWidth(element, width) {
        let strWidth = width.toFixed(2);
        strWidth = width > 0 ? strWidth : "0";
        element.style.width = `${strWidth}px`;
    }
    static getInstanceId() {
        return ResizableTableColumns.instancesCount++;
    }
    static debounce = (func, wait, immediate) => {
        let timeout = null;
        const debounced = (event) => {
            const later = () => {
                timeout = null;
                if (!immediate) {
                    func(event);
                }
            };
            const callNow = immediate && !timeout;
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(later, wait);
            if (callNow) {
                func(event);
            }
        };
        return debounced;
    };
    static getPointerX(event) {
        if (event.type.indexOf("touch") === 0) {
            const tEvent = event;
            if (tEvent.touches?.length) {
                return tEvent.touches[0].pageX;
            }
            if (tEvent.changedTouches?.length) {
                return tEvent.changedTouches[0].pageX;
            }
        }
        return event.pageX;
    }
    static getTextWidth(contentElement, measurementElement) {
        if (!contentElement || !measurementElement)
            return 0;
        var text = `${contentElement.textContent?.trim().replace(/\s/g, "&nbsp;")}&nbsp;`; //add extra space to ensure we are not add the `...`
        const styles = contentElement.ownerDocument.defaultView?.getComputedStyle(contentElement);
        ["fontFamily", "fontSize", "fontWeight", "padding", "border", "boxSizing"].forEach((prop) => {
            measurementElement.style[prop] = styles[prop];
        });
        measurementElement.innerHTML = text;
        return measurementElement.offsetWidth;
    }
    static getOffset(el) {
        if (!el)
            return { top: 0, left: 0 };
        const rect = el.getBoundingClientRect();
        return {
            top: rect.top + el.ownerDocument.body.scrollTop,
            left: rect.left + el.ownerDocument.body.scrollLeft,
        };
    }
}
//# sourceMappingURL=resizable-table-columns.js.map