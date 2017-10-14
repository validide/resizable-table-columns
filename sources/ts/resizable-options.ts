export default class ResizableOptions {
  resizeFromBody: boolean;
  minWidth: null | number;
  maxWidth: null | number;
  obeyCssMinWidth: boolean;
  obeyCssMaxWidth: boolean;
  doubleClickDelay: number;
  store: any;

  constructor(options: null | object, element: null | HTMLElement) {
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


  overrideValues(options: null | object): void {
    if (!options)
      return;

    for (let prop in options) {
      if (this.hasOwnProperty(prop)) {
        this[prop] = options[prop];
      }
    }
  }

  overrideValuesFromElement(element: null | HTMLElement): void {
    if (!element)
      return;

    const elementOptions = {};
    for (let i=0; i < element.attributes.length; i++) {
      elementOptions[element.attributes[i].name] = element.attributes[i].value;
    }
    this.overrideValues(elementOptions)
  }
}
