import { UtilitiesDOM } from './utilities-dom';
var ResizableOptions = /** @class */ (function () {
    function ResizableOptions(options, element) {
        if (options === void 0) { options = null; }
        if (element === void 0) { element = null; }
        this.resizeFromBody = true;
        this.minWidth = 40;
        this.maxWidth = null;
        this.doubleClickDelay = 500;
        this.maxInitialWidthHint = null;
        this.store = null;
        this.rtl = false;
        this.rtlClass = null;
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
    ResizableOptions.prototype.isRtl = function (element) {
        if (this.rtlClass != null && (element === null || element === void 0 ? void 0 : element.classList.contains(this.rtlClass))) {
            return true;
        }
        return this.rtl;
    };
    return ResizableOptions;
}());
export { ResizableOptions };
//# sourceMappingURL=resizable-options.js.map