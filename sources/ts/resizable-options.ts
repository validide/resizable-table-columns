import { UtilitiesDOM } from "./utilities-dom";

export interface IStore {
  get(id: string): unknown;
  set(id: string, data: unknown): void;
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
    if (!options) return;

    for (const prop in options) {
      if (Object.hasOwn(this, prop)) {
        (this as unknown as Record<string, unknown>)[prop] = (options as unknown as Record<string, unknown>)[prop];
      }
    }
  }

  overrideValuesFromElement(element: null | HTMLElement = null): void {
    if (!element) return;

    const elementOptions = UtilitiesDOM.getDataAttributesValues(element);
    this.overrideValues(elementOptions);
  }
}
