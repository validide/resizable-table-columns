export interface IStore {
    get(id: string): unknown;
    set(id: string, data: unknown): void;
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
