export interface IStore {
    get(id: string): unknown;
    set(id: string, data: unknown): void;
}
/** The shape of the data persisted through {@link IStore} for a table. */
export interface IStoredWidths {
    table: number;
    columns: Record<string, number>;
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
//# sourceMappingURL=resizable-options.d.ts.map