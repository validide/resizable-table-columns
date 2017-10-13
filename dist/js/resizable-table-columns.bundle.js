(function () {
'use strict';

var Utilities = (function () {
    function Utilities() {
    }
    Utilities.escapeRegExp = function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };
    return Utilities;
}());

var UtilitiesDOM = (function () {
    function UtilitiesDOM() {
    }
    UtilitiesDOM.prototype.addClass = function (el, className) {
        if (el.classList)
            el.classList.add(className);
        else if (!this.hasClass(el, className))
            el.className += " " + className;
    };
    UtilitiesDOM.prototype.removeClass = function (el, className) {
        if (el.classList)
            el.classList.remove(className);
        else if (this.hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + Utilities.escapeRegExp(className) + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
        }
    };
    UtilitiesDOM.prototype.hasClass = function (el, className) {
        if (el.classList)
            return el.classList.contains(className);
        else
            return !!el.className.match(new RegExp('(\\s|^)' + Utilities.escapeRegExp(className) + '(\\s|$)'));
    };
    return UtilitiesDOM;
}());

var ResizableTableColumns = (function () {
    function ResizableTableColumns() {
    }
    ResizableTableColumns.prototype.init = function () {
        var utils = new UtilitiesDOM();
        utils.addClass(null, '');
    };
    ResizableTableColumns.prototype.dispose = function () {
    };
    return ResizableTableColumns;
}());

}());
