import { UtilitiesDOM } from "./utilities-dom";

export interface IStore {
  get(id: string): unknown;
  set(id: string, data: unknown): void;
}

/** The shape of the data persisted through {@link IStore} for a table. */
export interface IStoredWidths {
  table: number;
  columns: Record<string, number>;
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

    const self = this as unknown as Record<string, unknown>;
    for (const [prop, value] of Object.entries(options)) {
      if (Object.hasOwn(this, prop)) {
        self[prop] = value;
      }
    }
  }

  overrideValuesFromElement(element: null | HTMLElement = null): void {
    if (!element) return;

    this.overrideValues(UtilitiesDOM.getDataAttributesValues(element));
  }
}
