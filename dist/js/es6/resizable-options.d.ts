export declare class ResizableOptions {
    resizeFromBody: boolean;
    minWidth: null | number;
    maxWidth: null | number;
    maxInitialWidth: null | number;
    obeyCssMinWidth: boolean;
    obeyCssMaxWidth: boolean;
    doubleClickDelay: number;
    store: any;
    constructor(options?: null | object, element?: null | HTMLElement);
    overrideValues(options?: null | object): void;
    overrideValuesFromElement(element?: null | HTMLElement): void;
}
