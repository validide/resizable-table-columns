import { ResizableOptions } from './resizable-options';
import { ResizableEventData } from './resizable-event-data';
export declare class ResizableTableColumns {
    static instancesCount: number;
    static windowResizeHandlerRegistered: boolean;
    table: HTMLTableElement;
    options: ResizableOptions;
    id: number;
    wrapper: HTMLDivElement | null;
    ownerDocument: Document;
    tableHeaders: HTMLTableHeaderCellElement[];
    dragHandlesContainer: HTMLDivElement | null;
    originalWidths: {
        [id: string]: string;
    };
    eventData: ResizableEventData | null;
    lastPointerDown: number;
    onPointerDownRef: any;
    onPointerMoveRef: any;
    onPointerUpRef: any;
    constructor(table: HTMLTableElement, options: ResizableOptions | null);
    init(): void;
    dispose(): void;
    validateMarkup(): void;
    wrapTable(): void;
    unwrapTable(): void;
    asignTableHeaders(): void;
    storeOriginalWidths(): void;
    restoreOriginalWidths(): void;
    setHeaderWidths(): void;
    constrainWidth(el: HTMLElement, width: number): number;
    createDragHandles(): void;
    destroyDragHandles(): void;
    getDragHandlers(): Array<HTMLDivElement>;
    restoreColumnWidths(): void;
    checkTableWidth(): void;
    syncHandleWidths(): void;
    getResizableHeaders(): HTMLTableCellElement[];
    handlePointerDown(event: Event): void;
    handlePointerMove(event: Event): void;
    handlePointerUp(): void;
    handleDoubleClick(): void;
    attachHandlers(): void;
    detachHandlers(): void;
    refreshWrapperStyle(): void;
    saveColumnWidths(): void;
    createHandlerReferences(): void;
    registerWindowResizeHandler(): void;
    handleWindowResize(): void;
    static onWindowResize(event: Event): void;
    static generateColumnId(el: HTMLElement): string;
    static generateTableId(table: HTMLTableElement): string;
    static getWidth(el: HTMLElement): number;
    static getComputedWidth(el: HTMLElement): number;
    static setWidth(element: HTMLElement, width: number): void;
    static getInstanceId(): number;
}
