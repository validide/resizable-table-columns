export interface IStore {
    get(id: string): any;
    set(id: string, data: any): void;
}
export declare class ResizableOptions {
    resizeFromBody: boolean;
    minWidth: null | number;
    maxWidth: null | number;
    maxInitialWidthHint: null | number;
    doubleClickDelay: number;
    store: IStore | null;
    constructor(options?: null | object, element?: null | HTMLElement);
    overrideValues(options?: null | object): void;
    overrideValuesFromElement(element?: null | HTMLElement): void;
}
