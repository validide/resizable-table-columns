interface IClassesConstants {
  table: string;
  wrapper: string;
  handleContainer: string;
  handle: string;
  hidden: string;
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
}

export default class ResizableConstants {
  static dataPropertyname: string = 'rtc_data_object';
  static classes: IClassesConstants = {
    table: 'rtc-table',
    wrapper: 'rtc-wrapper',
    handleContainer: 'rtc-handle-container',
    handle: 'rtc-handle',
    hidden: 'rtc-hidden'
  };
  static attibutes: IAttributesConstants = {
    dataResizable: 'data-rtc-resizable',
    dataResizableTable: 'data-rtc-resizable-table'
  };
  static data: IDataConstants = {
    resizable: 'rtcResizable',
    resizableTable: 'rtcResizableTable'
  };
  static events: IEvents = {
    pointerDown: ['mousedown', 'touchstart']
  }
}
