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
    return UtilitiesDOM;
}());
export default UtilitiesDOM;
