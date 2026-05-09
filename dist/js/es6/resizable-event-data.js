export class WidthsData {
    column = 0;
    table = 0;
}
export class PointerData {
    x = null;
    isDoubleClick = false;
}
export class ResizableEventData {
    column;
    dragHandler;
    pointer = new PointerData();
    originalWidths = new WidthsData();
    newWidths = new WidthsData();
    constructor(column, dragHandler) {
        this.column = column;
        this.dragHandler = dragHandler;
    }
}
//# sourceMappingURL=resizable-event-data.js.map