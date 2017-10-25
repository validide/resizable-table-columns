var ResizableConstants = (function () {
    function ResizableConstants() {
    }
    ResizableConstants.dataPropertyname = 'rtc_data_object';
    ResizableConstants.classes = {
        table: 'rtc-table',
        wrapper: 'rtc-wrapper',
        handleContainer: 'rtc-handle-container',
        handle: 'rtc-handle',
        hidden: 'rtc-hidden'
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
        pointerDown: ['mousedown', 'touchstart']
    };
    return ResizableConstants;
}());
export default ResizableConstants;
