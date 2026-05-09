export const ResizableConstants = {
    dataPropertyName: "validide_rtc_data_object",
    classes: {
        table: "rtc-table",
        wrapper: "rtc-wrapper",
        handleContainer: "rtc-handle-container",
        handle: "rtc-handle",
        tableResizing: "rtc-table-resizing",
        columnResizing: "rtc-column-resizing",
    },
    attributes: {
        dataResizable: "data-rtc-resizable",
        dataResizableTable: "data-rtc-resizable-table",
    },
    data: {
        resizable: "rtcResizable",
        resizableTable: "rtcResizableTable",
    },
    events: {
        pointerDown: ["mousedown", "touchstart"],
        pointerMove: ["mousemove", "touchmove"],
        pointerUp: ["mouseup", "touchend"],
        windowResize: ["resize"],
        eventResizeStart: "eventResizeStart.rtc",
        eventResize: "eventResize.rtc",
        eventResizeStop: "eventResizeStop.rtc",
    },
};
//# sourceMappingURL=resizable-constants.js.map