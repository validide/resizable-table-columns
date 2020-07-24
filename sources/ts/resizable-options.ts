import UtilitiesDOM from './utilities-dom'

export default class ResizableOptions {
  resizeFromBody: boolean;
  minWidth: null | number;
  maxWidth: null | number;
  obeyCssMinWidth: boolean;
  obeyCssMaxWidth: boolean;
  doubleClickDelay: number;
  store: any;

  constructor(options: null | object = null, element: null | HTMLElement = null) {
    this.resizeFromBody = true;
    this.minWidth = 40;
    this.maxWidth = null;
    this.obeyCssMinWidth = false;
    this.obeyCssMaxWidth = false;
    this.doubleClickDelay = 500;
    this.store = null;

    this.overrideValues(options);
    this.overrideValuesFromElement(element);
  }


  overrideValues(options: null | object = null): void {
    if (!options)
      return;

    for (let prop in options) {
      if (this.hasOwnProperty(prop)) {
        (this as any)[prop] = (options as any)[prop];
      }
    }
  }

  overrideValuesFromElement(element: null | HTMLElement = null): void {
    if (!element)
      return;

    const elementOptions = UtilitiesDOM.getDataAttributesValues(element);
    this.overrideValues(elementOptions)
  }
}
