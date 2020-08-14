export declare class UtilitiesDOM {
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
