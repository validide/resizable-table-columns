var ResizableTableColumns = (function () {
'use strict';

var Utilities = (function () {
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

var UtilitiesDOM = (function () {
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
                    returnValue[prop] = Utilities.parseStringToType(el.dataset[prop]);
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
        var computedStyle = el.ownerDocument.defaultView.getComputedStyle(el).minWidth;
        var minWidth = Utilities.parseStyleDimension(computedStyle, true);
        if (typeof minWidth === 'number' && !isNaN(minWidth))
            return minWidth;
        return null;
    };
    UtilitiesDOM.getMaxCssWidth = function (el) {
        var computedStyle = el.ownerDocument.defaultView.getComputedStyle(el).maxWidth;
        var maxWidth = Utilities.parseStyleDimension(computedStyle, true);
        if (typeof maxWidth === 'number' && !isNaN(maxWidth))
            return maxWidth;
        return null;
    };
    UtilitiesDOM.getOuterWidth = function (el, includeMargin) {
        if (includeMargin === void 0) { includeMargin = false; }
        var width = el.offsetWidth;
        if (!includeMargin)
            return width;
        var computedStyles = el.ownerDocument.defaultView.getComputedStyle(el);
        var marginTop = Utilities.parseStyleDimension(computedStyles.marginTop, false);
        var marginBottom = Utilities.parseStyleDimension(computedStyles.marginBottom, false);
        return width + marginTop + marginBottom;
    };
    UtilitiesDOM.getInnerWidth = function (el) {
        var width = UtilitiesDOM.getOuterWidth(el);
        var computedStyles = el.ownerDocument.defaultView.getComputedStyle(el);
        var borderLeft = Utilities.parseStyleDimension(computedStyles.borderLeft, false);
        var borderRight = Utilities.parseStyleDimension(computedStyles.borderRight, false);
        return width - borderLeft - borderRight;
    };
    UtilitiesDOM.getWidth = function (el) {
        var width = UtilitiesDOM.getOuterWidth(el);
        var computedStyles = el.ownerDocument.defaultView.getComputedStyle(el);
        var paddingLeft = Utilities.parseStyleDimension(computedStyles.paddingLeft, false);
        var paddingRight = Utilities.parseStyleDimension(computedStyles.paddingRight, false);
        var borderLeft = Utilities.parseStyleDimension(computedStyles.borderLeft, false);
        var borderRight = Utilities.parseStyleDimension(computedStyles.borderRight, false);
        return width - paddingLeft - paddingRight - borderLeft - borderRight;
    };
    UtilitiesDOM.getOuterHeight = function (el, includeMargin) {
        if (includeMargin === void 0) { includeMargin = false; }
        var height = el.offsetHeight;
        if (!includeMargin)
            return height;
        var computedStyles = el.ownerDocument.defaultView.getComputedStyle(el);
        var marginTop = Utilities.parseStyleDimension(computedStyles.marginTop, false);
        var marginBottom = Utilities.parseStyleDimension(computedStyles.marginBottom, false);
        return height + marginTop + marginBottom;
    };
    UtilitiesDOM.getInnerHeight = function (el) {
        var height = UtilitiesDOM.getOuterHeight(el);
        var computedStyles = el.ownerDocument.defaultView.getComputedStyle(el);
        var borderTop = Utilities.parseStyleDimension(computedStyles.borderTop, false);
        var borderBottom = Utilities.parseStyleDimension(computedStyles.borderBottom, false);
        return height - borderTop - borderBottom;
    };
    UtilitiesDOM.getHeight = function (el) {
        var height = UtilitiesDOM.getOuterHeight(el);
        var computedStyles = el.ownerDocument.defaultView.getComputedStyle(el);
        var paddingTop = Utilities.parseStyleDimension(computedStyles.paddingTop, false);
        var paddingBottom = Utilities.parseStyleDimension(computedStyles.paddingBottom, false);
        var borderTop = Utilities.parseStyleDimension(computedStyles.borderTop, false);
        var borderBottom = Utilities.parseStyleDimension(computedStyles.borderBottom, false);
        return height - paddingTop - paddingBottom - borderTop - borderBottom;
    };
    UtilitiesDOM.getOffset = function (el) {
        var rect = el.getBoundingClientRect();
        return {
            top: rect.top + el.ownerDocument.body.scrollTop,
            left: rect.left + el.ownerDocument.body.scrollLeft
        };
    };
    return UtilitiesDOM;
}());

var ResizableOptions = (function () {
    function ResizableOptions(options, element) {
        this.resizeFromBody = true;
        this.minWidth = 40;
        this.maxWidth = null;
        this.obeyCssMinWidth = false;
        this.obeyCssMaxWidth = false;
        this.doubleClickDelay = 500;
        this.store = null;
        this.overrideValues(options);
        this.overrideValuesFromElement(element);
    }
    ResizableOptions.prototype.overrideValues = function (options) {
        if (!options)
            return;
        for (var prop in options) {
            if (this.hasOwnProperty(prop)) {
                this[prop] = options[prop];
            }
        }
    };
    ResizableOptions.prototype.overrideValuesFromElement = function (element) {
        if (!element)
            return;
        var elementOptions = UtilitiesDOM.getDataAttributesValues(element);
        this.overrideValues(elementOptions);
    };
    return ResizableOptions;
}());

var ResizableConstants = (function () {
    function ResizableConstants() {
    }
    ResizableConstants.dataPropertyname = 'rtc_data_object';
    ResizableConstants.classes = {
        table: 'rtc-table',
        wrapper: 'rtc-wrapper',
        handleContainer: 'rtc-handle-container',
        handle: 'rtc-handle',
        hidden: 'rtc-hidden'
    };
    ResizableConstants.attibutes = {
        dataResizable: 'data-rtc-resizable',
        dataResizableTable: 'data-rtc-resizable-table'
    };
    ResizableConstants.data = {
        resizable: 'rtcResizable',
        resizableTable: 'rtcResizableTable'
    };
    ResizableConstants.events = {
        pointerDown: ['mousedown', 'touchstart']
    };
    return ResizableConstants;
}());

var ResizableTableColumns = (function () {
    function ResizableTableColumns(table, options) {
        this.originalWidths = {};
        if (typeof table !== 'object' || table === null || table.toString() !== '[object HTMLTableElement]')
            throw 'Invalid argument: "table".\nResizableTableColumns requires that the table element is a not null HTMLTableElement object!';
        if (typeof table[ResizableConstants.dataPropertyname] !== 'undefined')
            throw "Existing \"" + ResizableConstants.dataPropertyname + "\" property.\nTable elemet already has a '" + ResizableConstants.dataPropertyname + "' attached object!";
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
    ResizableTableColumns.prototype.init = function () {
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
    };
    ResizableTableColumns.prototype.dispose = function () {
        UtilitiesDOM.removeClass(this.table, ResizableConstants.classes.table);
        this.destroyDragHandles();
        this.restoreHeaderOriginalWidths();
        this.unwrapTable();
        this.table[ResizableConstants.dataPropertyname] = void (0);
    };
    ResizableTableColumns.prototype.validateMarkup = function () {
        var theadCount = 0;
        var tbodyCount = 0;
        var thead;
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
        if (theadCount !== 1)
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
        if (theadRowCount < 1)
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
    };
    ResizableTableColumns.prototype.unwrapTable = function () {
        if (!this.wrapper)
            return;
        var tableOriginalParent = this.wrapper.parentNode;
        tableOriginalParent.insertBefore(this.table, this.wrapper);
        tableOriginalParent.removeChild(this.wrapper);
        this.wrapper = null;
    };
    ResizableTableColumns.prototype.asignTableHeaders = function () {
        var tableHeader;
        var firstTableRow;
        for (var index = 0; index < this.table.childNodes.length; index++) {
            var element = this.table.childNodes[index];
            if (element.nodeName === 'THEAD') {
                tableHeader = element;
                break;
            }
        }
        for (var index = 0; index < tableHeader.childNodes.length; index++) {
            var element = tableHeader.childNodes[index];
            if (element.nodeName === 'TR') {
                firstTableRow = element;
                break;
            }
        }
        for (var index = 0; index < firstTableRow.childNodes.length; index++) {
            var element = firstTableRow.childNodes[index];
            if (element.nodeName === 'TH') {
                this.tableHeaders.push(element);
            }
        }
    };
    ResizableTableColumns.prototype.storeHeaderOriginalWidths = function () {
        var _this = this;
        this.tableHeaders
            .forEach(function (el, idx) {
            if (!el.hasAttribute(ResizableConstants.attibutes.dataResizable))
                return;
            var columnName = el.getAttribute(ResizableConstants.attibutes.dataResizable);
            _this.originalWidths["___." + columnName] = el.style.width;
        });
    };
    ResizableTableColumns.prototype.restoreHeaderOriginalWidths = function () {
        var _this = this;
        this.tableHeaders
            .forEach(function (el, idx) {
            if (!el.hasAttribute(ResizableConstants.attibutes.dataResizable))
                return;
            var columnName = el.getAttribute(ResizableConstants.attibutes.dataResizable);
            el.style.width = _this.originalWidths["___." + columnName];
        });
    };
    ResizableTableColumns.prototype.setHeaderWidths = function () {
        var _this = this;
        this.tableHeaders
            .forEach(function (el, idx) {
            if (!el.hasAttribute(ResizableConstants.attibutes.dataResizable))
                return;
            var width = UtilitiesDOM.getWidth(el);
            var minWidth = _this.options.obeyCssMinWidth
                ? UtilitiesDOM.getMinCssWidth(el)
                : null;
            if (minWidth != null) {
                width = Math.max(minWidth, width, _this.options.minWidth);
            }
            var maxWidth = _this.options.obeyCssMaxWidth
                ? UtilitiesDOM.getMaxCssWidth(el)
                : null;
            if (maxWidth != null) {
                width = Math.min(maxWidth, width, _this.options.maxWidth);
            }
            ResizableTableColumns.setWidth(el, width);
        });
    };
    ResizableTableColumns.setWidth = function (element, width) {
        var strWidth = width.toFixed(2);
        strWidth = width > 0 ? strWidth : '0';
        element.style.width = strWidth + "px";
    };
    ResizableTableColumns.prototype.createDragHandles = function () {
        var _this = this;
        if (this.dragHandlesContainer != null)
            throw 'Drag handlers allready created. Call <destroyDragHandles> if you wish to recreate them';
        this.dragHandlesContainer = this.ownerDocument.createElement('div');
        this.wrapper.insertBefore(this.dragHandlesContainer, this.table);
        UtilitiesDOM.addClass(this.dragHandlesContainer, ResizableConstants.classes.handleContainer);
        this.tableHeaders
            .forEach(function (el, idx) {
            if (!el.hasAttribute(ResizableConstants.attibutes.dataResizable))
                return;
            var handler = _this.ownerDocument.createElement('div');
            UtilitiesDOM.addClass(handler, ResizableConstants.classes.handle);
            _this.dragHandlesContainer.appendChild(handler);
        });
        this.getDragHandlers()
            .forEach(function (el, idx) {
            ResizableConstants.events.pointerDown
                .forEach(function (evt, evtIdx) {
                el.addEventListener(evt, ResizableTableColumns.onPointerDown, false);
            });
        });
    };
    ResizableTableColumns.prototype.destroyDragHandles = function () {
        if (this.dragHandlesContainer !== null) {
            this.getDragHandlers()
                .forEach(function (el, idx) {
                ResizableConstants.events.pointerDown
                    .forEach(function (evt, evtIdx) {
                    el.removeEventListener(evt, ResizableTableColumns.onPointerDown, false);
                });
            });
            this.dragHandlesContainer.parentElement.removeChild(this.dragHandlesContainer);
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
        var _this = this;
        if (!this.options.store)
            return;
        this.tableHeaders
            .forEach(function (el, idx) {
            if (!el.hasAttribute(ResizableConstants.attibutes.dataResizable))
                return;
            var width = _this.options.store.get(_this.generateColumnId(el));
            if (width != null) {
                ResizableTableColumns.setWidth(el, width);
            }
        });
    };
    ResizableTableColumns.prototype.generateColumnId = function ($el) {
        var columnId = ($el.getAttribute(ResizableConstants.attibutes.dataResizable) || '')
            .trim()
            .replace(/\./g, '_');
        return this.generateTableId() + "-" + columnId;
    };
    ResizableTableColumns.prototype.generateTableId = function () {
        var tableId = (this.table.getAttribute(ResizableConstants.attibutes.dataResizableTable) || '')
            .trim()
            .replace(/\./g, '_');
        return tableId.length === 0
            ? "rtc-table-" + this.id
            : tableId;
    };
    ResizableTableColumns.prototype.checkTableWidth = function () {
        UtilitiesDOM.addClass(this.table, ResizableConstants.classes.hidden);
        UtilitiesDOM.addClass(this.dragHandlesContainer, ResizableConstants.classes.hidden);
        var wrappperWidth = UtilitiesDOM.getWidth(this.wrapper);
        UtilitiesDOM.removeClass(this.table, ResizableConstants.classes.hidden);
        UtilitiesDOM.removeClass(this.dragHandlesContainer, ResizableConstants.classes.hidden);
        var tableWidth = UtilitiesDOM.getOuterWidth(this.table, true);
        var difference = wrappperWidth - tableWidth;
        if (difference > 0) {
            var totalWidth_1 = 0;
            var resizableWidth_1 = 0;
            var addedWidth = 0;
            var widths_1 = [];
            this.tableHeaders
                .forEach(function (el, idx) {
                var width = UtilitiesDOM.getWidth(el);
                widths_1.push(width);
                totalWidth_1 += width;
                if (el.hasAttribute(ResizableConstants.attibutes.dataResizable)) {
                    resizableWidth_1 += width;
                }
            });
            ResizableTableColumns.setWidth(this.table, wrappperWidth);
            for (var index = 0; index < this.tableHeaders.length; index++) {
                var el = this.tableHeaders[index];
                var currentWidth = widths_1.shift();
                if (el.hasAttribute(ResizableConstants.attibutes.dataResizable)) {
                    var newWidth = currentWidth + ((currentWidth / resizableWidth_1) * difference);
                    var leftToAdd = totalWidth_1 + difference - addedWidth;
                    newWidth = Math.min(newWidth, leftToAdd);
                    newWidth = Math.max(newWidth, 0);
                    ResizableTableColumns.setWidth(el, newWidth);
                    addedWidth += newWidth;
                }
                else {
                    addedWidth += currentWidth;
                }
                if (addedWidth >= totalWidth_1)
                    break;
            }
        }
    };
    ResizableTableColumns.prototype.syncHandleWidths = function () {
        var _this = this;
        var tableWidth = UtilitiesDOM.getWidth(this.table);
        ResizableTableColumns.setWidth(this.dragHandlesContainer, tableWidth);
        this.dragHandlesContainer.style.minWidth = tableWidth + "px";
        var headers = this.tableHeaders
            .filter(function (el, idx) {
            return el.hasAttribute(ResizableConstants.attibutes.dataResizable);
        });
        this.getDragHandlers()
            .forEach(function (el, idx) {
            var height = UtilitiesDOM.getInnerHeight(_this.options.resizeFromBody ? _this.table : _this.table.tHead);
            if (idx < headers.length) {
                var th = headers[idx];
                var computedStyles = getComputedStyle(th);
                var left = UtilitiesDOM.getOuterWidth(th);
                left -= Utilities.parseStyleDimension(computedStyles.paddingLeft, false);
                left -= Utilities.parseStyleDimension(computedStyles.paddingRight, false);
                left += UtilitiesDOM.getOffset(th).left;
                left -= UtilitiesDOM.getOffset(_this.dragHandlesContainer).left;
                el.style.left = left + "px";
                el.style.height = height + "px";
            }
        });
    };
    ResizableTableColumns.getInstanceId = function () {
        return ResizableTableColumns.instancesCount++;
    };
    ResizableTableColumns.onPointerDown = function (evt) {
        console.log('onPointerDown');
    };
    ResizableTableColumns.instancesCount = 0;
    return ResizableTableColumns;
}());

return ResizableTableColumns;

}());
