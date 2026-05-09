import { UtilitiesDOM } from "./utilities-dom";
export class ResizableOptions {
    resizeFromBody;
    minWidth;
    maxWidth;
    maxInitialWidthHint;
    doubleClickDelay;
    store;
    constructor(options = null, element = null) {
        this.resizeFromBody = true;
        this.minWidth = 40;
        this.maxWidth = null;
        this.doubleClickDelay = 500;
        this.maxInitialWidthHint = null;
        this.store = null;
        this.overrideValues(options);
        this.overrideValuesFromElement(element);
    }
    overrideValues(options = null) {
        if (!options)
            return;
        for (const prop in options) {
            if (Object.hasOwn(this, prop)) {
                this[prop] = options[prop];
            }
        }
    }
    overrideValuesFromElement(element = null) {
        if (!element)
            return;
        const elementOptions = UtilitiesDOM.getDataAttributesValues(element);
        this.overrideValues(elementOptions);
    }
}
//# sourceMappingURL=resizable-options.js.map