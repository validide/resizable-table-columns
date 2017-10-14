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
        var elementOptions = {};
        for (var i = 0; i < element.attributes.length; i++) {
            elementOptions[element.attributes[i].name] = element.attributes[i].value;
        }
        this.overrideValues(elementOptions);
    };
    return ResizableOptions;
}());
export default ResizableOptions;
