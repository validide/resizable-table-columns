(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.validide_resizableTableColumns = {}));
}(this, (function (exports) { 'use strict';

    var ResizableConstants = /** @class */ (function () {
        function ResizableConstants() {
        }
        ResizableConstants.dataPropertyName = 'validide_rtc_data_object';
        ResizableConstants.classes = {
            table: 'rtc-table',
            wrapper: 'rtc-wrapper',
            handleContainer: 'rtc-handle-container',
            handle: 'rtc-handle',
            tableResizing: 'rtc-table-resizing',
            columnResizing: 'rtc-column-resizing',
        };
        ResizableConstants.attributes = {
            dataResizable: 'data-rtc-resizable',
            dataResizableTable: 'data-rtc-resizable-table'
        };
        ResizableConstants.data = {
            resizable: 'rtcResizable',
            resizableTable: 'rtcResizableTable'
        };
        ResizableConstants.events = {
            pointerDown: ['mousedown', 'touchstart'],
            pointerMove: ['mousemove', 'touchmove'],
            pointerUp: ['mouseup', 'touchend'],
            windowResize: ['resize'],
            eventResizeStart: 'eventResizeStart.rtc',
            eventResize: 'eventResize.rtc',
            eventResizeStop: 'eventResizeStop.rtc'
        };
        return ResizableConstants;
    }());

    var WidthsData = /** @class */ (function () {
        function WidthsData() {
            this.column = 0;
            this.table = 0;
        }
        return WidthsData;
    }());
    var PointerData = /** @class */ (function () {
        function PointerData() {
            this.x = null;
            this.isDoubleClick = false;
        }
        return PointerData;
    }());
    var ResizableEventData = /** @class */ (function () {
        function ResizableEventData(column, dragHandler) {
            this.pointer = new PointerData();
            this.originalWidths = new WidthsData();
            this.newWidths = new WidthsData();
            this.column = column;
            this.dragHandler = dragHandler;
        }
        return ResizableEventData;
    }());

    var Utilities = /** @class */ (function () {
        function Utilities() {
        }
        Utilities.escapeRegExp = function (str) {
            return str.replace(Utilities.regexEscapeRegex, "\\$&");
        };
        Utilities.kebabCaseToCamelCase = function (str) {
            return str.replace(Utilities.kebabCaseRegex, function (m) { return m[1].toUpperCase(); });
        };
        Utilities.parseStringToType = function (str) {
            if (str.length == 0 || Utilities.onlyWhiteSpace.test(str))
                return str;
            if (Utilities.trueRegex.test(str))
                return true;
            if (Utilities.falseRegex.test(str))
                return false;
            if (Utilities.notEmptyOrWhiteSpace.test(str)) {
                var temp = +str;
                if (!isNaN(temp))
                    return temp;
            }
            return str;
        };
        Utilities.parseStyleDimension = function (dimension, returnOriginal) {
            if (typeof dimension === 'string') {
                if (dimension.length) {
                    var toParse = dimension
                        .replace('px', '')
                        .replace(',', '.');
                    var parsed = parseFloat(toParse);
                    if (!isNaN(parsed)) {
                        return parsed;
                    }
                }
            }
            else if (typeof dimension === 'number') {
                return dimension;
            }
            if (returnOriginal) {
                return dimension;
            }
            else {
                return 0;
            }
        };
        Utilities.regexEscapeRegex = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
        Utilities.kebabCaseRegex = /(\-\w)/g;
        Utilities.trueRegex = /^true$/i;
        Utilities.falseRegex = /^false$/i;
        Utilities.onlyWhiteSpace = /^\s$/;
        Utilities.notEmptyOrWhiteSpace = /\S/;
        return Utilities;
    }());

    var UtilitiesDOM = /** @class */ (function () {
        function UtilitiesDOM() {
        }
        UtilitiesDOM.addClass = function (el, className) {
            if (el.classList)
                el.classList.add(className);
            else if (!UtilitiesDOM.hasClass(el, className))
                el.className += " " + className;
        };
        UtilitiesDOM.removeClass = function (el, className) {
            if (el.classList)
                el.classList.remove(className);
            else if (UtilitiesDOM.hasClass(el, className)) {
                var reg = new RegExp('(\\s|^)' + Utilities.escapeRegExp(className) + '(\\s|$)');
                el.className = el.className.replace(reg, ' ');
            }
        };
        UtilitiesDOM.hasClass = function (el, className) {
            if (el.classList)
                return el.classList.contains(className);
            else
                return !!el.className.match(new RegExp('(\\s|^)' + Utilities.escapeRegExp(className) + '(\\s|$)'));
        };
        UtilitiesDOM.getDataAttributesValues = function (el) {
            if (!el)
                return null;
            var returnValue = {};
            if (el.dataset) {
                for (var prop in el.dataset) {
                    if (el.dataset.hasOwnProperty(prop)) {
                        returnValue[prop] = Utilities.parseStringToType(el.dataset[prop] || '');
                    }
                }
            }
            else {
                for (var i = 0; i < el.attributes.length; i++) {
                    if (!/^data\-/.test(el.attributes[i].name))
                        continue;
                    var name_1 = Utilities.kebabCaseToCamelCase(el.attributes[i].name.replace('data-', ''));
                    returnValue[name_1] = Utilities.parseStringToType(el.attributes[i].value);
                }
            }
            return returnValue;
        };
        UtilitiesDOM.getMinCssWidth = function (el) {
            var _a;
            var computedStyle = (_a = el.ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.getComputedStyle(el).minWidth;
            var minWidth = Utilities.parseStyleDimension(computedStyle, true);
            if (typeof minWidth === 'number' && !isNaN(minWidth))
                return minWidth;
            return null;
        };
        UtilitiesDOM.getMaxCssWidth = function (el) {
            var _a;
            var computedStyle = (_a = el.ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.getComputedStyle(el).maxWidth;
            var maxWidth = Utilities.parseStyleDimension(computedStyle, true);
            if (typeof maxWidth === 'number' && !isNaN(maxWidth))
                return maxWidth;
            return null;
        };
        UtilitiesDOM.getOuterWidth = function (el, includeMargin) {
            var _a;
            if (includeMargin === void 0) { includeMargin = false; }
            //TODO: Browser test this
            var width = el.offsetWidth;
            if (!includeMargin)
                return width;
            var computedStyles = (_a = el.ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.getComputedStyle(el);
            var marginTop = Utilities.parseStyleDimension(computedStyles === null || computedStyles === void 0 ? void 0 : computedStyles.marginTop, false);
            var marginBottom = Utilities.parseStyleDimension(computedStyles === null || computedStyles === void 0 ? void 0 : computedStyles.marginBottom, false);
            return width + marginTop + marginBottom;
        };
        UtilitiesDOM.getInnerWidth = function (el) {
            var _a;
            //TODO: Browser test this
            var width = UtilitiesDOM.getOuterWidth(el);
            var computedStyles = (_a = el.ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.getComputedStyle(el);
            var borderLeft = Utilities.parseStyleDimension(computedStyles === null || computedStyles === void 0 ? void 0 : computedStyles.borderLeft, false);
            var borderRight = Utilities.parseStyleDimension(computedStyles === null || computedStyles === void 0 ? void 0 : computedStyles.borderRight, false);
            return width - borderLeft - borderRight;
        };
        UtilitiesDOM.getWidth = function (el) {
            var _a;
            //TODO: Browser test this
            var width = UtilitiesDOM.getOuterWidth(el);
            var computedStyles = (_a = el.ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.getComputedStyle(el);
            var isBorderBox = (computedStyles === null || computedStyles === void 0 ? void 0 : computedStyles.boxSizing) === 'border-box';
            if (isBorderBox)
                return width;
            var paddingLeft = Utilities.parseStyleDimension(computedStyles === null || computedStyles === void 0 ? void 0 : computedStyles.paddingLeft, false);
            var paddingRight = Utilities.parseStyleDimension(computedStyles === null || computedStyles === void 0 ? void 0 : computedStyles.paddingRight, false);
            var borderLeft = Utilities.parseStyleDimension(computedStyles === null || computedStyles === void 0 ? void 0 : computedStyles.borderLeft, false);
            var borderRight = Utilities.parseStyleDimension(computedStyles === null || computedStyles === void 0 ? void 0 : computedStyles.borderRight, false);
            return width - paddingLeft - paddingRight - borderLeft - borderRight;
        };
        UtilitiesDOM.getOuterHeight = function (el, includeMargin) {
            var _a;
            if (includeMargin === void 0) { includeMargin = false; }
            //TODO: Browser test this
            var height = el.offsetHeight;
            if (!includeMargin)
                return height;
            var computedStyles = (_a = el.ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.getComputedStyle(el);
            var marginTop = Utilities.parseStyleDimension(computedStyles === null || computedStyles === void 0 ? void 0 : computedStyles.marginTop, false);
            var marginBottom = Utilities.parseStyleDimension(computedStyles === null || computedStyles === void 0 ? void 0 : computedStyles.marginBottom, false);
            return height + marginTop + marginBottom;
        };
        UtilitiesDOM.getInnerHeight = function (el) {
            var _a;
            //TODO: Browser test this
            var height = UtilitiesDOM.getOuterHeight(el);
            var computedStyles = (_a = el.ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.getComputedStyle(el);
            var borderTop = Utilities.parseStyleDimension(computedStyles === null || computedStyles === void 0 ? void 0 : computedStyles.borderTop, false);
            var borderBottom = Utilities.parseStyleDimension(computedStyles === null || computedStyles === void 0 ? void 0 : computedStyles.borderBottom, false);
            return height - borderTop - borderBottom;
        };
        UtilitiesDOM.getHeight = function (el) {
            var _a;
            //TODO: Browser test this
            var height = UtilitiesDOM.getOuterHeight(el);
            var computedStyles = (_a = el.ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.getComputedStyle(el);
            var paddingTop = Utilities.parseStyleDimension(computedStyles === null || computedStyles === void 0 ? void 0 : computedStyles.paddingTop, false);
            var paddingBottom = Utilities.parseStyleDimension(computedStyles === null || computedStyles === void 0 ? void 0 : computedStyles.paddingBottom, false);
            var borderTop = Utilities.parseStyleDimension(computedStyles === null || computedStyles === void 0 ? void 0 : computedStyles.borderTop, false);
            var borderBottom = Utilities.parseStyleDimension(computedStyles === null || computedStyles === void 0 ? void 0 : computedStyles.borderBottom, false);
            return height - paddingTop - paddingBottom - borderTop - borderBottom;
        };
        UtilitiesDOM.getOffset = function (el) {
            if (!el)
                return { top: 0, left: 0 };
            var rect = el.getBoundingClientRect();
            return {
                top: rect.top + el.ownerDocument.body.scrollTop,
                left: rect.left + el.ownerDocument.body.scrollLeft
            };
        };
        UtilitiesDOM.matches = function (el, selector) {
            var matchesFn = undefined;
            // find vendor prefix
            var matchNames = ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'];
            for (var index = 0; index < matchNames.length; index++) {
                if (typeof el.ownerDocument.body[matchNames[index]] === 'function') {
                    matchesFn = matchNames[index];
                    break;
                }
            }
            return matchesFn ? el[matchesFn](selector) : false;
        };
        UtilitiesDOM.closest = function (el, selector) {
            if (!el)
                return null;
            if (typeof el.closest === 'function')
                return el.closest(selector);
            var element = el;
            while (element && element.nodeType === 1) {
                if (UtilitiesDOM.matches(element, selector)) {
                    return element;
                }
                element = element.parentNode;
            }
            return null;
        };
        UtilitiesDOM.getPointerX = function (event) {
            //TODO: Browser test this
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
        UtilitiesDOM.getTextWidth = function (contentElement, measurementElement) {
            var _a, _b;
            //TODO: Browser test this
            if (!contentElement || !measurementElement)
                return 0;
            var text = ((_a = contentElement.textContent) === null || _a === void 0 ? void 0 : _a.trim().replace(/\s/g, '&nbsp;')) + '&nbsp;'; //add extra space to ensure we are not elipsing anything
            var styles = (_b = contentElement.ownerDocument.defaultView) === null || _b === void 0 ? void 0 : _b.getComputedStyle(contentElement);
            ['fontFamily', 'fontSize', 'fontWeight', 'padding', 'border', 'boxSizing']
                .forEach(function (prop) {
                measurementElement.style[prop] = styles[prop];
            });
            measurementElement.innerHTML = text;
            return UtilitiesDOM.getOuterWidth(measurementElement, true);
        };
        return UtilitiesDOM;
    }());

    var ResizableOptions = /** @class */ (function () {
        function ResizableOptions(options, element) {
            if (options === void 0) { options = null; }
            if (element === void 0) { element = null; }
            this.resizeFromBody = true;
            this.minWidth = 40;
            this.maxWidth = null;
            this.obeyCssMinWidth = false;
            this.obeyCssMaxWidth = false;
            this.doubleClickDelay = 500;
            this.maxInitialWidthHint = null;
            this.store = null;
            this.overrideValues(options);
            this.overrideValuesFromElement(element);
        }
        ResizableOptions.prototype.overrideValues = function (options) {
            if (options === void 0) { options = null; }
            if (!options)
                return;
            for (var prop in options) {
                if (this.hasOwnProperty(prop)) {
                    this[prop] = options[prop];
                }
            }
        };
        ResizableOptions.prototype.overrideValuesFromElement = function (element) {
            if (element === void 0) { element = null; }
            if (!element)
                return;
            var elementOptions = UtilitiesDOM.getDataAttributesValues(element);
            this.overrideValues(elementOptions);
        };
        return ResizableOptions;
    }());

    var ResizableTableColumns = /** @class */ (function () {
        function ResizableTableColumns(table, options) {
            if (typeof table !== 'object' || table === null || table.toString() !== '[object HTMLTableElement]')
                throw 'Invalid argument: "table".\nResizableTableColumns requires that the table element is a not null HTMLTableElement object!';
            if (typeof table[ResizableConstants.dataPropertyName] !== 'undefined')
                throw "Existing \"" + ResizableConstants.dataPropertyName + "\" property.\nTable element already has a '" + ResizableConstants.dataPropertyName + "' attached object!";
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
                throw "Markup validation: thead count.\nResizableTableColumns requires that the table element has one(1) table head element. Current count: " + theadCount;
            if (tbodyCount !== 1)
                throw "Markup validation: tbody count.\nResizableTableColumns requires that the table element has one(1) table body element. Current count: " + tbodyCount;
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
                throw "Markup validation: thead row count.\nResizableTableColumns requires that the table head element has at least one(1) table row element. Current count: " + theadRowCount;
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
                throw "Markup validation: thead first row cells count.\nResizableTableColumns requires that the table head's first row element has at least one(1) table header cell element. Current count: " + headerCellsCount;
            if (invalidHeaderCellsCount !== 0)
                throw "Markup validation: thead first row invalid.\nResizableTableColumns requires that the table head's first row element has no(0) table cell(TD) elements. Current count: " + invalidHeaderCellsCount;
        };
        ResizableTableColumns.prototype.wrapTable = function () {
            if (this.wrapper)
                return;
            this.wrapper = this.ownerDocument.createElement('div');
            var tableOriginalParent = this.table.parentNode;
            tableOriginalParent.insertBefore(this.wrapper, this.table);
            tableOriginalParent.removeChild(this.table);
            this.wrapper.appendChild(this.table);
            UtilitiesDOM.addClass(this.wrapper, ResizableConstants.classes.wrapper);
            UtilitiesDOM.addClass(this.table, ResizableConstants.classes.table);
        };
        ResizableTableColumns.prototype.unwrapTable = function () {
            UtilitiesDOM.removeClass(this.table, ResizableConstants.classes.table);
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
                .forEach(function (el, idx) {
                _this.originalWidths["___." + idx] = el.style.width;
            });
            this.originalWidths["___.table"] = this.table.style.width;
        };
        ResizableTableColumns.prototype.restoreOriginalWidths = function () {
            var _this = this;
            this.tableHeaders
                .forEach(function (el, idx) {
                el.style.width = _this.originalWidths["___." + idx];
            });
            this.table.style.width = this.originalWidths["___.table"];
        };
        ResizableTableColumns.prototype.setHeaderWidths = function () {
            var _this = this;
            this.tableHeaders
                .forEach(function (el, idx) {
                var width = UtilitiesDOM.getWidth(el);
                var constrainedWidth = _this.constrainWidth(el, width);
                if (typeof _this.options.maxInitialWidthHint === 'number') {
                    constrainedWidth = Math.min(constrainedWidth, _this.options.maxInitialWidthHint);
                }
                _this.setCellWidth(el, constrainedWidth, true);
            });
        };
        ResizableTableColumns.prototype.constrainWidth = function (el, width) {
            var result = width;
            var minWidth = this.options.obeyCssMinWidth
                ? UtilitiesDOM.getMinCssWidth(el)
                : -Infinity;
            result = Math.max(result, minWidth || 0, this.options.minWidth || -Infinity);
            var maxWidth = this.options.obeyCssMaxWidth
                ? UtilitiesDOM.getMaxCssWidth(el)
                : +Infinity;
            result = Math.min(result, maxWidth || 0, this.options.maxWidth || +Infinity);
            return result;
        };
        ResizableTableColumns.prototype.createDragHandles = function () {
            var _this = this;
            var _a;
            if (this.dragHandlesContainer != null)
                throw 'Drag handlers already created. Call <destroyDragHandles> if you wish to recreate them';
            this.dragHandlesContainer = this.ownerDocument.createElement('div');
            (_a = this.wrapper) === null || _a === void 0 ? void 0 : _a.insertBefore(this.dragHandlesContainer, this.table);
            UtilitiesDOM.addClass(this.dragHandlesContainer, ResizableConstants.classes.handleContainer);
            this.getResizableHeaders()
                .forEach(function (el, idx) {
                var _a;
                var handler = _this.ownerDocument.createElement('div');
                UtilitiesDOM.addClass(handler, ResizableConstants.classes.handle);
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
                : this.dragHandlesContainer.querySelectorAll("." + ResizableConstants.classes.handle);
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
                .forEach(function (el, idx) {
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
            var wrapperWidth = UtilitiesDOM.getWidth(this.wrapper);
            //might bee needed to exclude margins/borders/paddings
            var tableWidth = UtilitiesDOM.getOuterWidth(this.table, true);
            var difference = wrapperWidth - tableWidth;
            if (difference > 0) {
                var totalWidth_1 = 0;
                var resizableWidth_1 = 0;
                var addedWidth = 0;
                var widths_1 = [];
                this.tableHeaders
                    .forEach(function (el, idx) {
                    //might bee needed to include margins/borders/paddings
                    var width = ResizableTableColumns.getWidth(el);
                    widths_1.push(width);
                    totalWidth_1 += width;
                    if (el.hasAttribute(ResizableConstants.attributes.dataResizable)) {
                        resizableWidth_1 += width;
                    }
                });
                var leftToAdd = 0;
                var lastResizableCell = null;
                for (var index = 0; index < this.tableHeaders.length; index++) {
                    var el = this.tableHeaders[index];
                    var currentWidth = widths_1.shift();
                    if (el.hasAttribute(ResizableConstants.attributes.dataResizable)) {
                        lastResizableCell = el;
                        var newWidth = currentWidth + ((currentWidth / resizableWidth_1) * difference);
                        leftToAdd = totalWidth_1 + difference - addedWidth;
                        newWidth = Math.min(newWidth, leftToAdd);
                        newWidth = Math.max(newWidth, 0); // Do not add a negative width
                        var setWidth = this.setCellWidth(el, newWidth, false);
                        addedWidth += setWidth;
                    }
                    else {
                        addedWidth += currentWidth;
                    }
                    if (addedWidth >= totalWidth_1)
                        break;
                }
                leftToAdd = totalWidth_1 - addedWidth;
                if (leftToAdd > 0) {
                    var lastCell = lastResizableCell || this.tableHeaders[this.tableHeaders.length - 1];
                    var lastCellWidth = ResizableTableColumns.getWidth(lastCell);
                    this.setCellWidth(lastCell, lastCellWidth, true);
                }
            }
        };
        ResizableTableColumns.prototype.syncHandleWidths = function () {
            var _this = this;
            var tableWidth = UtilitiesDOM.getWidth(this.table);
            ResizableTableColumns.setWidth(this.dragHandlesContainer, tableWidth);
            this.dragHandlesContainer.style.minWidth = tableWidth + "px";
            var headers = this.getResizableHeaders();
            this.getDragHandlers()
                .forEach(function (el, idx) {
                var height = UtilitiesDOM.getInnerHeight((_this.options.resizeFromBody ? _this.table : _this.table.tHead));
                if (idx < headers.length) {
                    var th = headers[idx];
                    var left = UtilitiesDOM.getOuterWidth(th);
                    left += UtilitiesDOM.getOffset(th).left;
                    left -= UtilitiesDOM.getOffset(_this.dragHandlesContainer).left;
                    el.style.left = left + "px";
                    el.style.height = height + "px";
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
            if (target.nodeName !== 'DIV' || !UtilitiesDOM.hasClass(target, ResizableConstants.classes.handle))
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
            var columnWidth = ResizableTableColumns.getWidth(column);
            var tableWidth = ResizableTableColumns.getWidth(this.table);
            var widths = {
                column: columnWidth,
                table: tableWidth
            };
            var eventData = new ResizableEventData(column, dragHandler);
            eventData.pointer = {
                x: UtilitiesDOM.getPointerX(event),
                isDoubleClick: isDoubleClick
            };
            eventData.originalWidths = widths;
            eventData.newWidths = widths;
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
                    tableWidth: tableWidth,
                    widthRatio: ResizableTableColumns.getWidthRatio(column)
                }
            });
            this.table.dispatchEvent(eventToDispatch);
            event.preventDefault();
        };
        ResizableTableColumns.prototype.handlePointerMove = function (event) {
            if (!this.eventData || !event)
                return;
            var difference = (UtilitiesDOM.getPointerX(event) || 0) - (this.eventData.pointer.x || 0);
            if (difference === 0) {
                return;
            }
            var widthRatio = ResizableTableColumns.getWidthRatio(this.eventData.column);
            difference = difference * widthRatio;
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
                    tableWidth: tableWidth,
                    widthRatio: widthRatio
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
            UtilitiesDOM.removeClass(this.table, ResizableConstants.classes.tableResizing);
            UtilitiesDOM.removeClass(this.wrapper, ResizableConstants.classes.tableResizing);
            UtilitiesDOM.removeClass(this.eventData.dragHandler, ResizableConstants.classes.columnResizing);
            UtilitiesDOM.removeClass(this.eventData.column, ResizableConstants.classes.columnResizing);
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
                    tableWidth: widths.table,
                    widthRatio: ResizableTableColumns.getWidthRatio(this.eventData.column)
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
                        maxWidth = Math.max(maxWidth, UtilitiesDOM.getTextWidth(cell, span));
                        break;
                    }
                    currentIndex += colSpan;
                }
            }
            this.ownerDocument.body.removeChild(span);
            var difference = maxWidth - ResizableTableColumns.getComputedWidth(column);
            if (difference === 0) {
                return;
            }
            var widthRatio = ResizableTableColumns.getWidthRatio(column);
            difference = difference * widthRatio;
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
                    tableWidth: tableWidth,
                    widthRatio: ResizableTableColumns.getWidthRatio(this.eventData.column)
                }
            });
            this.table.dispatchEvent(eventToDispatch);
            this.checkTableWidth();
            this.syncHandleWidths();
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
                table: ResizableTableColumns.getWidth(this.table),
                columns: {}
            };
            this.getResizableHeaders()
                .forEach(function (el, idx) {
                data.columns[ResizableTableColumns.generateColumnId(el)] = ResizableTableColumns.getWidth(el);
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
            if (ResizableTableColumns.windowResizeHandlerRegistered)
                return;
            ResizableTableColumns.windowResizeHandlerRegistered = true;
            ResizableConstants.events.windowResize
                .forEach(function (evt, idx) {
                win === null || win === void 0 ? void 0 : win.addEventListener(evt, ResizableTableColumns.onWindowResize, false);
            });
        };
        ResizableTableColumns.prototype.handleWindowResize = function () {
            this.checkTableWidth();
            this.syncHandleWidths();
        };
        ResizableTableColumns.prototype.setCellWidth = function (cell, suggestedWidth, skipConstrainCheck) {
            var widthRatio = ResizableTableColumns.getWidthRatio(cell);
            var originalCellWidth = ResizableTableColumns.getWidth(cell);
            var difference = suggestedWidth - originalCellWidth;
            difference = difference * widthRatio;
            var tableWidth = ResizableTableColumns.getWidth(this.table) + difference;
            var columnWidth = skipConstrainCheck
                ? originalCellWidth + difference
                : this.constrainWidth(cell, originalCellWidth + difference);
            ResizableTableColumns.setWidth(this.table, tableWidth);
            ResizableTableColumns.setWidth(cell, columnWidth);
            return columnWidth;
        };
        ResizableTableColumns.onWindowResize = function (event) {
            var target = event ? event.target : null;
            if (target == null)
                return;
            var tables = target.document.querySelectorAll("." + ResizableConstants.classes.table);
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
                ? "rtc/" + tableId
                : tableId;
        };
        ResizableTableColumns.getWidth = function (el) {
            if (el.style.width === '')
                return UtilitiesDOM.getWidth(el);
            return Utilities.parseStyleDimension(el.style.width, false);
        };
        ResizableTableColumns.getComputedWidth = function (el) {
            var _a;
            return Utilities.parseStyleDimension((_a = el.ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.getComputedStyle(el).width, false);
        };
        ResizableTableColumns.getWidthRatio = function (el) {
            var width = ResizableTableColumns.getWidth(el);
            var computedWidth = ResizableTableColumns.getComputedWidth(el);
            var ratio = width / computedWidth;
            return ResizableTableColumns.round(Math.min(1, ratio), 2);
        };
        ResizableTableColumns.round = function (value, places) {
            var multiplier = Math.pow(10, places);
            return (Math.round(value * multiplier) / multiplier);
        };
        ResizableTableColumns.setWidth = function (element, width) {
            var strWidth = width.toFixed(2);
            strWidth = width > 0 ? strWidth : '0';
            element.style.width = strWidth + "px";
        };
        ResizableTableColumns.getInstanceId = function () {
            return ResizableTableColumns.instancesCount++;
        };
        ResizableTableColumns.instancesCount = 0;
        ResizableTableColumns.windowResizeHandlerRegistered = false;
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

    exports.PointerData = PointerData;
    exports.ResizableConstants = ResizableConstants;
    exports.ResizableEventData = ResizableEventData;
    exports.ResizableOptions = ResizableOptions;
    exports.ResizableTableColumns = ResizableTableColumns;
    exports.Utilities = Utilities;
    exports.UtilitiesDOM = UtilitiesDOM;
    exports.WidthsData = WidthsData;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
