import { Utilities } from './utilities';
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
export { UtilitiesDOM };
//# sourceMappingURL=utilities-dom.js.map