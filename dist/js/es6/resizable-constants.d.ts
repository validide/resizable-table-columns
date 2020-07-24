interface IClassesConstants {
    table: string;
    wrapper: string;
    handleContainer: string;
    handle: string;
    tableResizing: string;
    columnResizing: string;
}
interface IAttributesConstants {
    dataResizable: string;
    dataResizableTable: string;
}
interface IDataConstants {
    resizable: string;
    resizableTable: string;
}
interface IEvents {
    pointerDown: Array<string>;
    pointerMove: Array<string>;
    pointerUp: Array<string>;
    windowResize: Array<string>;
    eventResizeStart: string;
    eventResize: string;
    eventResizeStop: string;
}
export default class ResizableConstants {
    static dataPropertyname: string;
    static classes: IClassesConstants;
    static attibutes: IAttributesConstants;
    static data: IDataConstants;
    static events: IEvents;
}
export {};
