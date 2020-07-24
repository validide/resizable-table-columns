export declare class WidthsData {
    column: number;
    table: number;
}
export declare class PointerData {
    x: number | null;
    isDoubleClick: boolean;
}
export declare class ResizableEventData {
    column: HTMLTableCellElement;
    dragHandler: HTMLDivElement;
    pointer: PointerData;
    originalWidths: WidthsData;
    newWidths: WidthsData;
    constructor(column: HTMLTableCellElement, dragHandler: HTMLDivElement);
}
