import { ResizableConstants } from './resizable-constants';
import { ResizableEventData } from './resizable-event-data';
import { ResizableOptions } from './resizable-options';
var ResizableTableColumns = /** @class */ (function () {
    function ResizableTableColumns(table, options) {
        if (typeof table !== 'object' || table === null || table.toString() !== '[object HTMLTableElement]')
            throw 'Invalid argument: "table".\nResizableTableColumns requires that the table element is a not null HTMLTableElement object!';
        if (typeof table[ResizableConstants.dataPropertyName] !== 'undefined')
            throw "Existing \"".concat(ResizableConstants.dataPropertyName, "\" property.\nTable element already has a '").concat(ResizableConstants.dataPropertyName, "' attached object!");
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
    ResizableTableColumns.prototype.init = function () {
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
    };
    ResizableTableColumns.prototype.dispose = function () {
        this.destroyDragHandles();
        this.restoreOriginalWidths();
        this.unwrapTable();
        this.onPointerDownRef = null;
        this.onPointerMoveRef = null;
        this.onPointerUpRef = null;
        this.table[ResizableConstants.dataPropertyName] = void (0);
    };
    ResizableTableColumns.prototype.validateMarkup = function () {
        var theadCount = 0;
        var tbodyCount = 0;
        var thead = null;
        for (var index = 0; index < this.table.childNodes.length; index++) {
            var element = this.table.childNodes[index];
            if (element.nodeName === 'THEAD') {
                theadCount++;
                thead = element;
            }
            else if (element.nodeName === 'TBODY') {
                tbodyCount++;
            }
        }
        if (thead === null || theadCount !== 1)
            throw "Markup validation: thead count.\nResizableTableColumns requires that the table element has one(1) table head element. Current count: ".concat(theadCount);
        if (tbodyCount !== 1)
            throw "Markup validation: tbody count.\nResizableTableColumns requires that the table element has one(1) table body element. Current count: ".concat(tbodyCount);
        var theadRowCount = 0;
        var firstRow = null;
        for (var index = 0; index < thead.childNodes.length; index++) {
            var element = thead.childNodes[index];
            if (element.nodeName === 'TR') {
                theadRowCount++;
                if (firstRow === null) {
                    firstRow = element;
                }
            }
        }
        if (firstRow === null || theadRowCount < 1)
            throw "Markup validation: thead row count.\nResizableTableColumns requires that the table head element has at least one(1) table row element. Current count: ".concat(theadRowCount);
        var headerCellsCount = 0;
        var invalidHeaderCellsCount = 0;
        for (var index = 0; index < firstRow.childNodes.length; index++) {
            var element = firstRow.childNodes[index];
            if (element.nodeName === 'TH') {
                headerCellsCount++;
            }
            else if (element.nodeName === 'TD') {
                invalidHeaderCellsCount++;
            }
        }
        if (headerCellsCount < 1)
            throw "Markup validation: thead first row cells count.\nResizableTableColumns requires that the table head's first row element has at least one(1) table header cell element. Current count: ".concat(headerCellsCount);
        if (invalidHeaderCellsCount !== 0)
            throw "Markup validation: thead first row invalid.\nResizableTableColumns requires that the table head's first row element has no(0) table cell(TD) elements. Current count: ".concat(invalidHeaderCellsCount);
    };
    ResizableTableColumns.prototype.wrapTable = function () {
        if (this.wrapper)
            return;
        this.wrapper = this.ownerDocument.createElement('div');
        this.wrapper.classList.add(ResizableConstants.classes.wrapper);
        var tableOriginalParent = this.table.parentNode;
        tableOriginalParent.insertBefore(this.wrapper, this.table);
        tableOriginalParent.removeChild(this.table);
        this.wrapper.appendChild(this.table);
        this.table.classList.add(ResizableConstants.classes.table);
    };
    ResizableTableColumns.prototype.unwrapTable = function () {
        this.table.classList.remove(ResizableConstants.classes.table);
        if (!this.wrapper)
            return;
        var tableOriginalParent = this.wrapper.parentNode;
        tableOriginalParent.insertBefore(this.table, this.wrapper);
        tableOriginalParent.removeChild(this.wrapper);
        this.wrapper = null;
    };
    ResizableTableColumns.prototype.assignTableHeaders = function () {
        var tableHeader;
        var firstTableRow;
        for (var index = 0; index < this.table.childNodes.length; index++) {
            var element = this.table.childNodes[index];
            if (element.nodeName === 'THEAD') {
                tableHeader = element;
                break;
            }
        }
        if (!tableHeader)
            return;
        for (var index = 0; index < tableHeader.childNodes.length; index++) {
            var element = tableHeader.childNodes[index];
            if (element.nodeName === 'TR') {
                firstTableRow = element;
                break;
            }
        }
        if (!firstTableRow)
            return;
        for (var index = 0; index < firstTableRow.childNodes.length; index++) {
            var element = firstTableRow.childNodes[index];
            if (element.nodeName === 'TH') {
                this.tableHeaders.push(element);
            }
        }
    };
    ResizableTableColumns.prototype.storeOriginalWidths = function () {
        var _this = this;
        this.tableHeaders
            .forEach(function (el) {
            _this.originalWidths.push({
                el: el,
                detail: el.style.width
            });
        });
        this.originalWidths.push({
            el: this.table,
            detail: this.table.style.width
        });
    };
    ResizableTableColumns.prototype.restoreOriginalWidths = function () {
        this.originalWidths
            .forEach(function (itm) {
            itm.el.style.width = itm.detail;
        });
    };
    ResizableTableColumns.prototype.setHeaderWidths = function () {
        var _this = this;
        this.tableHeaders
            .forEach(function (el) {
            var width = el.offsetWidth;
            var constrainedWidth = _this.constrainWidth(el, width);
            if (typeof _this.options.maxInitialWidthHint === 'number') {
                constrainedWidth = Math.min(constrainedWidth, _this.options.maxInitialWidthHint);
            }
            _this.updateWidth(el, constrainedWidth, true, false);
        });
    };
    ResizableTableColumns.prototype.constrainWidth = function (el, width) {
        var result = width;
        result = Math.max(result, this.options.minWidth || -Infinity);
        result = Math.min(result, this.options.maxWidth || +Infinity);
        return result;
    };
    ResizableTableColumns.prototype.createDragHandles = function () {
        var _this = this;
        var _a;
        if (this.dragHandlesContainer != null)
            throw 'Drag handlers already created. Call <destroyDragHandles> if you wish to recreate them';
        this.dragHandlesContainer = this.ownerDocument.createElement('div');
        (_a = this.wrapper) === null || _a === void 0 ? void 0 : _a.insertBefore(this.dragHandlesContainer, this.table);
        this.dragHandlesContainer.classList.add(ResizableConstants.classes.handleContainer);
        this.getResizableHeaders()
            .forEach(function () {
            var _a;
            var handler = _this.ownerDocument.createElement('div');
            handler.classList.add(ResizableConstants.classes.handle);
            (_a = _this.dragHandlesContainer) === null || _a === void 0 ? void 0 : _a.appendChild(handler);
        });
        ResizableConstants.events.pointerDown
            .forEach(function (evt, evtIdx) {
            var _a;
            (_a = _this.dragHandlesContainer) === null || _a === void 0 ? void 0 : _a.addEventListener(evt, _this.onPointerDownRef, false);
        });
    };
    ResizableTableColumns.prototype.destroyDragHandles = function () {
        var _this = this;
        var _a, _b;
        if (this.dragHandlesContainer !== null) {
            ResizableConstants.events.pointerDown
                .forEach(function (evt, evtIdx) {
                var _a;
                (_a = _this.dragHandlesContainer) === null || _a === void 0 ? void 0 : _a.removeEventListener(evt, _this.onPointerDownRef, false);
            });
            (_b = (_a = this.dragHandlesContainer) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.removeChild(this.dragHandlesContainer);
        }
    };
    ResizableTableColumns.prototype.getDragHandlers = function () {
        var nodes = this.dragHandlesContainer == null
            ? null
            : this.dragHandlesContainer.querySelectorAll(".".concat(ResizableConstants.classes.handle));
        return nodes
            ? Array.prototype.slice.call(nodes).filter(function (el) { return el.nodeName === 'DIV'; })
            : new Array();
    };
    ResizableTableColumns.prototype.restoreColumnWidths = function () {
        if (!this.options.store)
            return;
        var tableId = ResizableTableColumns.generateTableId(this.table);
        if (tableId.length === 0)
            return;
        var data = this.options.store.get(tableId);
        if (!data)
            return;
        this.getResizableHeaders()
            .forEach(function (el) {
            var width = data.columns[ResizableTableColumns.generateColumnId(el)];
            if (typeof width !== 'undefined') {
                ResizableTableColumns.setWidth(el, width);
            }
        });
        if (typeof data.table !== 'undefined') {
            ResizableTableColumns.setWidth(this.table, data.table);
        }
    };
    ResizableTableColumns.prototype.checkTableWidth = function () {
        var _a;
        var wrapperWidth = this.wrapper.clientWidth;
        var tableWidth = this.table.offsetWidth;
        var difference = wrapperWidth - tableWidth;
        if (difference <= 0)
            return;
        var resizableWidth = 0;
        var addedWidth = 0;
        var headersDetails = [];
        this.tableHeaders
            .forEach(function (el, idx) {
            if (el.hasAttribute(ResizableConstants.attributes.dataResizable)) {
                var detail = {
                    el: el,
                    detail: el.offsetWidth
                };
                headersDetails.push(detail);
                resizableWidth += detail.detail;
            }
        });
        var leftToAdd = 0;
        var lastResizableCell = null;
        var currentDetail;
        while ((currentDetail = headersDetails.shift())) {
            leftToAdd = difference - addedWidth;
            lastResizableCell = currentDetail.el;
            var extraWidth = Math.floor((currentDetail.detail / resizableWidth) * difference);
            extraWidth = Math.min(extraWidth, leftToAdd);
            var newWidth = this.updateWidth(currentDetail.el, currentDetail.detail + extraWidth, false, true);
            addedWidth += (newWidth - currentDetail.detail);
            if (addedWidth >= difference)
                break;
        }
        leftToAdd = difference - addedWidth;
        if (leftToAdd > 0) {
            var lastCell = ((_a = headersDetails[0]) === null || _a === void 0 ? void 0 : _a.el) || lastResizableCell || this.tableHeaders[this.tableHeaders.length - 1];
            var lastCellWidth = lastCell.offsetWidth;
            this.updateWidth(lastCell, lastCellWidth, true, true);
        }
        ResizableTableColumns.setWidth(this.table, wrapperWidth);
    };
    ResizableTableColumns.prototype.syncHandleWidths = function () {
        var _this = this;
        var tableWidth = this.table.clientWidth;
        ResizableTableColumns.setWidth(this.dragHandlesContainer, tableWidth);
        this.dragHandlesContainer.style.minWidth = "".concat(tableWidth, "px");
        var headers = this.getResizableHeaders();
        this.getDragHandlers()
            .forEach(function (el, idx) {
            var height = (_this.options.resizeFromBody ? _this.table : _this.table.tHead).clientHeight;
            if (idx < headers.length) {
                var th = headers[idx];
                var left = th.offsetWidth;
                left += ResizableTableColumns.getOffset(th).left;
                left -= ResizableTableColumns.getOffset(_this.dragHandlesContainer).left;
                el.style.left = "".concat(left, "px");
                el.style.height = "".concat(height, "px");
            }
        });
    };
    ResizableTableColumns.prototype.getResizableHeaders = function () {
        return this.tableHeaders
            .filter(function (el, idx) {
            return el.hasAttribute(ResizableConstants.attributes.dataResizable);
        });
    };
    ResizableTableColumns.prototype.handlePointerDown = function (event) {
        this.handlePointerUp();
        var target = event ? event.target : null;
        if (target == null)
            return;
        if (target.nodeName !== 'DIV' || !target.classList.contains(ResizableConstants.classes.handle))
            return;
        if (typeof event.button === 'number' && event.button !== 0)
            return; // this is not a left click
        var dragHandler = target;
        var gripIndex = this.getDragHandlers().indexOf(dragHandler);
        var resizableHeaders = this.getResizableHeaders();
        if (gripIndex >= resizableHeaders.length)
            return;
        var millisecondsNow = (new Date()).getTime();
        var isDoubleClick = (millisecondsNow - this.lastPointerDown) < this.options.doubleClickDelay;
        var column = resizableHeaders[gripIndex];
        var columnWidth = column.offsetWidth;
        var widths = {
            column: columnWidth,
            table: this.table.offsetWidth
        };
        var eventData = new ResizableEventData(column, dragHandler);
        eventData.pointer = {
            x: ResizableTableColumns.getPointerX(event),
            isDoubleClick: isDoubleClick
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
                tableWidth: this.table.clientWidth
            }
        });
        this.table.dispatchEvent(eventToDispatch);
        event.preventDefault();
    };
    ResizableTableColumns.prototype.handlePointerMove = function (event) {
        if (!this.eventData || !event)
            return;
        var difference = (ResizableTableColumns.getPointerX(event) || 0) - (this.eventData.pointer.x || 0);
        if (difference === 0) {
            return;
        }
        var tableWidth = this.eventData.originalWidths.table + difference;
        var columnWidth = this.constrainWidth(this.eventData.column, this.eventData.originalWidths.column + difference);
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
    };
    ResizableTableColumns.prototype.handlePointerUp = function () {
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
        var widths = this.eventData.newWidths || this.eventData.originalWidths;
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
    };
    ResizableTableColumns.prototype.handleDoubleClick = function () {
        if (!this.eventData || !this.eventData.column)
            return;
        var column = this.eventData.column;
        var colIndex = this.tableHeaders.indexOf(column);
        var maxWidth = 0;
        var indicesToSkip = [];
        this.tableHeaders
            .forEach(function (el, idx) {
            if (!el.hasAttribute(ResizableConstants.attributes.dataResizable)) {
                indicesToSkip.push(idx);
            }
        });
        var span = this.ownerDocument.createElement('span');
        span.style.position = 'absolute';
        span.style.left = '-99999px';
        span.style.top = '-99999px';
        span.style.visibility = 'hidden';
        this.ownerDocument.body.appendChild(span);
        var rows = this.table.querySelectorAll('tr');
        for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            var element = rows[rowIndex];
            var cells = element.querySelectorAll('td, th');
            var currentIndex = 0;
            for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                var cell = cells[cellIndex];
                var colSpan = 1;
                if (cell.hasAttribute('colspan')) {
                    var colSpanString = cell.getAttribute('colspan') || '1';
                    var parsed = parseInt(colSpanString);
                    if (!isNaN(parsed)) {
                        colSpan = parsed;
                    }
                    else {
                        colSpan = 1;
                    }
                }
                if (indicesToSkip.indexOf(cellIndex) === -1
                    && colSpan === 1
                    && currentIndex === colIndex) {
                    maxWidth = Math.max(maxWidth, ResizableTableColumns.getTextWidth(cell, span));
                    break;
                }
                currentIndex += colSpan;
            }
        }
        this.ownerDocument.body.removeChild(span);
        var difference = maxWidth - column.offsetWidth;
        if (difference === 0) {
            return;
        }
        var tableWidth = this.eventData.originalWidths.table + difference;
        var columnWidth = this.constrainWidth(this.eventData.column, this.eventData.originalWidths.column + difference);
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
                tableWidth: tableWidth
            }
        });
        this.table.dispatchEvent(eventToDispatch);
        this.checkTableWidth();
        this.syncHandleWidths();
        this.saveColumnWidths();
    };
    ResizableTableColumns.prototype.attachHandlers = function () {
        var _this = this;
        ResizableConstants.events.pointerMove
            .forEach(function (evt, evtIdx) {
            _this.ownerDocument.addEventListener(evt, _this.onPointerMoveRef, false);
        });
        ResizableConstants.events.pointerUp
            .forEach(function (evt, evtIdx) {
            _this.ownerDocument.addEventListener(evt, _this.onPointerUpRef, false);
        });
    };
    ResizableTableColumns.prototype.detachHandlers = function () {
        var _this = this;
        ResizableConstants.events.pointerMove
            .forEach(function (evt, evtIdx) {
            _this.ownerDocument.removeEventListener(evt, _this.onPointerMoveRef, false);
        });
        ResizableConstants.events.pointerUp
            .forEach(function (evt, evtIdx) {
            _this.ownerDocument.removeEventListener(evt, _this.onPointerUpRef, false);
        });
    };
    ResizableTableColumns.prototype.refreshWrapperStyle = function () {
        if (this.wrapper == null)
            return;
        var original = this.wrapper.style.overflowX;
        this.wrapper.style.overflowX = 'hidden';
        this.wrapper.style.overflowX = original;
    };
    ResizableTableColumns.prototype.saveColumnWidths = function () {
        if (!this.options.store)
            return;
        var tableId = ResizableTableColumns.generateTableId(this.table);
        if (tableId.length === 0)
            return;
        var data = {
            table: this.table.offsetWidth,
            columns: {}
        };
        this.getResizableHeaders()
            .forEach(function (el) {
            data.columns[ResizableTableColumns.generateColumnId(el)] = el.offsetWidth;
        });
        this.options.store.set(tableId, data);
    };
    ResizableTableColumns.prototype.createHandlerReferences = function () {
        var _this = this;
        if (!this.onPointerDownRef) {
            this.onPointerDownRef = ResizableTableColumns.debounce(function (evt) {
                _this.handlePointerDown(evt);
            }, 100, true);
        }
        if (!this.onPointerMoveRef) {
            this.onPointerMoveRef = ResizableTableColumns.debounce(function (evt) {
                _this.handlePointerMove(evt);
            }, 5, false);
        }
        if (!this.onPointerUpRef) {
            this.onPointerUpRef = ResizableTableColumns.debounce(function (evt) {
                _this.handlePointerUp();
            }, 100, true);
        }
    };
    ResizableTableColumns.prototype.registerWindowResizeHandler = function () {
        var win = this.ownerDocument.defaultView;
        if (ResizableTableColumns.windowResizeHandlerRef)
            return;
        ResizableTableColumns.windowResizeHandlerRef = ResizableTableColumns.debounce(ResizableTableColumns.onWindowResize, 50, false);
        ResizableConstants.events.windowResize
            .forEach(function (evt, idx) {
            win === null || win === void 0 ? void 0 : win.addEventListener(evt, ResizableTableColumns.windowResizeHandlerRef, false);
        });
    };
    ResizableTableColumns.prototype.handleWindowResize = function () {
        this.checkTableWidth();
        this.syncHandleWidths();
        this.saveColumnWidths();
    };
    ResizableTableColumns.prototype.updateWidth = function (cell, suggestedWidth, skipConstrainCheck, skipTableResize) {
        var originalCellWidth = cell.offsetWidth;
        var columnWidth = skipConstrainCheck
            ? suggestedWidth
            : this.constrainWidth(cell, suggestedWidth);
        ResizableTableColumns.setWidth(cell, columnWidth);
        if (!skipTableResize) {
            var difference = columnWidth - originalCellWidth;
            var tableWidth = this.table.offsetWidth + difference;
            ResizableTableColumns.setWidth(this.table, tableWidth);
        }
        return columnWidth;
    };
    ResizableTableColumns.onWindowResize = function (event) {
        var win = event ? event.target : null;
        if (win == null)
            return;
        var tables = win.document.querySelectorAll(".".concat(ResizableConstants.classes.table));
        for (var index = 0; index < tables.length; index++) {
            var table = tables[index];
            if (typeof table[ResizableConstants.dataPropertyName] !== 'object')
                continue;
            table[ResizableConstants.dataPropertyName].handleWindowResize();
        }
    };
    ResizableTableColumns.generateColumnId = function (el) {
        var columnId = (el.getAttribute(ResizableConstants.attributes.dataResizable) || '')
            .trim()
            .replace(/\./g, '_');
        return columnId;
    };
    ResizableTableColumns.generateTableId = function (table) {
        var tableId = (table.getAttribute(ResizableConstants.attributes.dataResizableTable) || '')
            .trim()
            .replace(/\./g, '_');
        return tableId.length
            ? "rtc/".concat(tableId)
            : tableId;
    };
    ResizableTableColumns.setWidth = function (element, width) {
        var strWidth = width.toFixed(2);
        strWidth = width > 0 ? strWidth : '0';
        element.style.width = "".concat(strWidth, "px");
    };
    ResizableTableColumns.getInstanceId = function () {
        return ResizableTableColumns.instancesCount++;
    };
    ResizableTableColumns.getPointerX = function (event) {
        if (event.type.indexOf('touch') === 0) {
            var tEvent = event;
            if (tEvent.touches && tEvent.touches.length) {
                return tEvent.touches[0].pageX;
            }
            if (tEvent.changedTouches && tEvent.changedTouches.length) {
                return tEvent.changedTouches[0].pageX;
            }
        }
        return event.pageX;
    };
    ResizableTableColumns.getTextWidth = function (contentElement, measurementElement) {
        var _a, _b;
        if (!contentElement || !measurementElement)
            return 0;
        var text = ((_a = contentElement.textContent) === null || _a === void 0 ? void 0 : _a.trim().replace(/\s/g, '&nbsp;')) + '&nbsp;'; //add extra space to ensure we are not add the `...`
        var styles = (_b = contentElement.ownerDocument.defaultView) === null || _b === void 0 ? void 0 : _b.getComputedStyle(contentElement);
        ['fontFamily', 'fontSize', 'fontWeight', 'padding', 'border', 'boxSizing']
            .forEach(function (prop) {
            measurementElement.style[prop] = styles[prop];
        });
        measurementElement.innerHTML = text;
        return measurementElement.offsetWidth;
    };
    ResizableTableColumns.getOffset = function (el) {
        if (!el)
            return { top: 0, left: 0 };
        var rect = el.getBoundingClientRect();
        return {
            top: rect.top + el.ownerDocument.body.scrollTop,
            left: rect.left + el.ownerDocument.body.scrollLeft
        };
    };
    ResizableTableColumns.instancesCount = 0;
    ResizableTableColumns.windowResizeHandlerRef = null;
    ResizableTableColumns.debounce = function (func, wait, immediate) {
        var timeout = null;
        var debounced = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var later = function () {
                timeout = null;
                if (!immediate) {
                    func.apply(void 0, args);
                }
            };
            var callNow = immediate && !timeout;
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(void 0, args);
            }
        };
        return debounced;
    };
    return ResizableTableColumns;
}());
export { ResizableTableColumns };
//# sourceMappingURL=resizable-table-columns.js.map