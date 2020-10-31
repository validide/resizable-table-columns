declare module "resizable-constants" {
    export interface IClassesConstants {
        table: string;
        wrapper: string;
        handleContainer: string;
        handle: string;
        tableResizing: string;
        columnResizing: string;
    }
    export interface IAttributesConstants {
        dataResizable: string;
        dataResizableTable: string;
    }
    export interface IDataConstants {
        resizable: string;
        resizableTable: string;
    }
    export interface IEvents {
        pointerDown: Array<string>;
        pointerMove: Array<string>;
        pointerUp: Array<string>;
        windowResize: Array<string>;
        eventResizeStart: string;
        eventResize: string;
        eventResizeStop: string;
    }
    export class ResizableConstants {
        static dataPropertyname: string;
        static classes: IClassesConstants;
        static attibutes: IAttributesConstants;
        static data: IDataConstants;
        static events: IEvents;
    }
}
declare module "resizable-event-data" {
    export class WidthsData {
        column: number;
        table: number;
    }
    export class PointerData {
        x: number | null;
        isDoubleClick: boolean;
    }
    export class ResizableEventData {
        column: HTMLTableCellElement;
        dragHandler: HTMLDivElement;
        pointer: PointerData;
        originalWidths: WidthsData;
        newWidths: WidthsData;
        widthRatio: number;
        constructor(column: HTMLTableCellElement, dragHandler: HTMLDivElement);
    }
}
declare module "utilities" {
    export interface IIndexedCollection<T> {
        [name: string]: T;
    }
    export class Utilities {
        static regexEscapeRegex: RegExp;
        static kebabCaseRegex: RegExp;
        static trueRegex: RegExp;
        static falseRegex: RegExp;
        static onlyWhiteSpace: RegExp;
        static notEmptyOrWhiteSpace: RegExp;
        static escapeRegExp(str: string): string;
        static kebabCaseToCamelCase(str: string): string;
        static parseStringToType(str: string): any;
        static parseStyleDimension(dimension: string | number | undefined, returnOriginal: boolean): number | string | undefined;
    }
}
declare module "utilities-dom" {
    export class UtilitiesDOM {
        static addClass(el: HTMLElement, className: string): void;
        static removeClass(el: HTMLElement, className: string): void;
        static hasClass(el: HTMLElement, className: string): boolean;
        static getDataAttributesValues(el: HTMLElement): object | null;
        static getMinCssWidth(el: HTMLElement): number | null;
        static getMaxCssWidth(el: HTMLElement): number | null;
        static getOuterWidth(el: HTMLElement, includeMargin?: boolean): number;
        static getInnerWidth(el: HTMLElement): number;
        static getWidth(el: HTMLElement): number;
        static getOuterHeight(el: HTMLElement, includeMargin?: boolean): number;
        static getInnerHeight(el: HTMLElement): number;
        static getHeight(el: HTMLElement): number;
        static getOffset(el: HTMLElement): {
            top: number;
            left: number;
        };
        static matches(el: Element, selector: string): boolean;
        static closest(el: Element, selector: string): Element | null;
        static getPointerX(event: Event): number | null;
        static getTextWidth(contentElement: HTMLElement, measurementElement: HTMLElement): number;
    }
}
declare module "resizable-options" {
    export class ResizableOptions {
        resizeFromBody: boolean;
        minWidth: null | number;
        maxWidth: null | number;
        obeyCssMinWidth: boolean;
        obeyCssMaxWidth: boolean;
        doubleClickDelay: number;
        store: any;
        constructor(options?: null | object, element?: null | HTMLElement);
        overrideValues(options?: null | object): void;
        overrideValuesFromElement(element?: null | HTMLElement): void;
    }
}
declare module "resizable-table-columns" {
    import { ResizableEventData } from "resizable-event-data";
    import { ResizableOptions } from "resizable-options";
    export class ResizableTableColumns {
        static instancesCount: number;
        static windowResizeHandlerRegistered: boolean;
        table: HTMLTableElement;
        options: ResizableOptions;
        id: number;
        wrapper: HTMLDivElement | null;
        ownerDocument: Document;
        tableHeaders: HTMLTableHeaderCellElement[];
        dragHandlesContainer: HTMLDivElement | null;
        originalWidths: {
            [id: string]: string;
        };
        eventData: ResizableEventData | null;
        lastPointerDown: number;
        onPointerDownRef: any;
        onPointerMoveRef: any;
        onPointerUpRef: any;
        constructor(table: HTMLTableElement, options: ResizableOptions | null);
        init(): void;
        dispose(): void;
        validateMarkup(): void;
        wrapTable(): void;
        unwrapTable(): void;
        assignTableHeaders(): void;
        storeOriginalWidths(): void;
        restoreOriginalWidths(): void;
        setHeaderWidths(): void;
        constrainWidth(el: HTMLElement, width: number): number;
        createDragHandles(): void;
        destroyDragHandles(): void;
        getDragHandlers(): Array<HTMLDivElement>;
        restoreColumnWidths(): void;
        checkTableWidth(): void;
        syncHandleWidths(): void;
        getResizableHeaders(): HTMLTableCellElement[];
        handlePointerDown(event: Event): void;
        handlePointerMove(event: Event): void;
        handlePointerUp(): void;
        handleDoubleClick(): void;
        attachHandlers(): void;
        detachHandlers(): void;
        refreshWrapperStyle(): void;
        saveColumnWidths(): void;
        createHandlerReferences(): void;
        registerWindowResizeHandler(): void;
        handleWindowResize(): void;
        static onWindowResize(event: Event): void;
        static generateColumnId(el: HTMLElement): string;
        static generateTableId(table: HTMLTableElement): string;
        static getWidth(el: HTMLElement): number;
        static getComputedWidth(el: HTMLElement): number;
        static getWidthRatio(el: HTMLElement): number;
        static setWidth(element: HTMLElement, width: number): void;
        static getInstanceId(): number;
        static debounce: <F extends (...args: any[]) => any>(func: Function, wait: number, immediate: boolean) => (...args: Parameters<F>) => ReturnType<F>;
    }
}
declare module "index" {
    export * from "resizable-constants";
    export * from "resizable-event-data";
    export * from "resizable-options";
    export * from "resizable-table-columns";
    export * from "utilities-dom";
    export * from "utilities";
}
