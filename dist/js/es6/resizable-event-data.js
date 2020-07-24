var WidthsData = /** @class */ (function () {
    function WidthsData() {
        this.column = 0;
        this.table = 0;
    }
    return WidthsData;
}());
export { WidthsData };
var PointerData = /** @class */ (function () {
    function PointerData() {
        this.x = null;
        this.isDoubleClick = false;
    }
    return PointerData;
}());
export { PointerData };
var ResizableEventData = /** @class */ (function () {
    function ResizableEventData(column, dragHandler) {
        this.pointer = new PointerData();
        this.originalWidths = new WidthsData();
        this.newWidths = new WidthsData();
        this.column = column;
        this.dragHandler = dragHandler;
    }
    return ResizableEventData;
}());
export { ResizableEventData };
//# sourceMappingURL=resizable-event-data.js.map