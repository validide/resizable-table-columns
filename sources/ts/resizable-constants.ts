interface IClassesConstants {
  tableClass:string;
  wrapperClass:string;
}

interface IAttributesConstants {
  dataResizable:string;
}

export default class ResizableConstants {
  static dataPropertyname: string = 'rtc_data_object';
  static classes : IClassesConstants = {
    tableClass: 'rtc-table',
    wrapperClass: 'rtc-wrapper'
  };
  static attibutes: IAttributesConstants = {
    dataResizable: 'data-resizable'
  };
}
