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
        const self = this;
        for (const [prop, value] of Object.entries(options)) {
            if (Object.hasOwn(this, prop)) {
                self[prop] = value;
            }
        }
    }
    overrideValuesFromElement(element = null) {
        if (!element)
            return;
        this.overrideValues(UtilitiesDOM.getDataAttributesValues(element));
    }
}
//# sourceMappingURL=resizable-options.js.map