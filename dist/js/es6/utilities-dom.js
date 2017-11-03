import Utilities from './utilities';
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
        if (!el)
            return null;
        var rect = el.getBoundingClientRect();
        return {
            top: rect.top + el.ownerDocument.body.scrollTop,
            left: rect.left + el.ownerDocument.body.scrollLeft
        };
    };
    UtilitiesDOM.matches = function (el, selector) {
        var matchesFn;
        var matchNames = ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'];
        for (var index = 0; index < matchNames.length; index++) {
            if (typeof el.ownerDocument.body[matchNames[index]] === 'function') {
                matchesFn = matchNames[index];
                break;
            }
        }
        return el[matchesFn](selector);
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
        if (event.type.indexOf('touch') === 0) {
            return (event.touches[0] || event.changedTouches[0]).pageX;
        }
        return event.pageX;
    };
    UtilitiesDOM.getTextWidth = function (contentElement, measurementElement) {
        if (!contentElement || !measurementElement)
            return 0;
        var text = contentElement.textContent.trim().replace(/\s/g, '&nbsp;') + '&nbsp;';
        var styles = contentElement.ownerDocument.defaultView.getComputedStyle(contentElement);
        ['fontFamily', 'fontSize', 'fontWeight', 'padding', 'border']
            .forEach(function (prop) {
            measurementElement.style[prop] = styles[prop];
        });
        measurementElement.innerHTML = text;
        return UtilitiesDOM.getOuterWidth(measurementElement, true);
    };
    return UtilitiesDOM;
}());
export default UtilitiesDOM;
