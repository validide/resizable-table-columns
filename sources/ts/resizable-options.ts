import { UtilitiesDOM } from './utilities-dom';

export interface IStore {
  get(id: string): any;
  set(id: string, data: any): void
}

export class ResizableOptions {
  resizeFromBody: boolean;
  minWidth: null | number;
  maxWidth: null | number;
  maxInitialWidthHint: null | number;
  doubleClickDelay: number;
  store: IStore | null;

  constructor(options: null | object = null, element: null | HTMLElement = null) {
    this.resizeFromBody = true;
    this.minWidth = 40;
    this.maxWidth = null;
    this.doubleClickDelay = 500;
    this.maxInitialWidthHint = null;
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
