var ResizableConstants = /** @class */ (function () {
    function ResizableConstants() {
    }
    ResizableConstants.dataPropertyname = 'validide_rtc_data_object';
    ResizableConstants.classes = {
        table: 'rtc-table',
        wrapper: 'rtc-wrapper',
        handleContainer: 'rtc-handle-container',
        handle: 'rtc-handle',
        tableResizing: 'rtc-table-resizing',
        columnResizing: 'rtc-column-resizing',
    };
    ResizableConstants.attibutes = {
        dataResizable: 'data-rtc-resizable',
        dataResizableTable: 'data-rtc-resizable-table'
    };
    ResizableConstants.data = {
        resizable: 'rtcResizable',
        resizableTable: 'rtcResizableTable'
    };
    ResizableConstants.events = {
        pointerDown: ['mousedown', 'touchstart'],
        pointerMove: ['mousemove', 'touchmove'],
        pointerUp: ['mouseup', 'touchend'],
        windowResize: ['resize'],
        eventResizeStart: 'eventResizeStart.rtc',
        eventResize: 'eventResize.rtc',
        eventResizeStop: 'eventResizeStop.rtc'
    };
    return ResizableConstants;
}());
export default ResizableConstants;
//# sourceMappingURL=resizable-constants.js.map