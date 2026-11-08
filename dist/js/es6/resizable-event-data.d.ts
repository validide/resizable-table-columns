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
/**
 * The `detail` payload of the `eventResizeStart.rtc`, `eventResize.rtc` and `eventResizeStop.rtc`
 * custom events dispatched on the table element.
 */
export interface ResizableEventDetail {
    column: HTMLTableCellElement;
    columnWidth: number;
    table: HTMLTableElement;
    tableWidth: number;
}
//# sourceMappingURL=resizable-event-data.d.ts.map