import Utilities, { IIndexedCollection } from './utilities'

export default class UtilitiesDOM {
  static addClass(el: HTMLElement, className: string) {
    if (el.classList)
      el.classList.add(className)
    else if (!UtilitiesDOM.hasClass(el, className))
      el.className += " " + className
  }

  static removeClass(el: HTMLElement, className: string) {
    if (el.classList)
      el.classList.remove(className)
    else if (UtilitiesDOM.hasClass(el, className)) {
      var reg = new RegExp('(\\s|^)' + Utilities.escapeRegExp(className) + '(\\s|$)')
      el.className = el.className.replace(reg, ' ')
    }
  }

  static hasClass(el: HTMLElement, className: string) {
    if (el.classList)
      return el.classList.contains(className)
    else
      return !!el.className.match(new RegExp('(\\s|^)' + Utilities.escapeRegExp(className) + '(\\s|$)'))
  }

  static getDataAttributesValues(el: HTMLElement): object | null {
    if (!el)
      return null;

    const returnValue: IIndexedCollection<any> = {};
    if (el.dataset) {
      for (let prop in el.dataset) {
        if (el.dataset.hasOwnProperty(prop)) {
          returnValue[prop] = Utilities.parseStringToType(el.dataset[prop] || '');
        }
      }
    }
    else {
      for (let i = 0; i < el.attributes.length; i++) {
        if (!/^data\-/.test(el.attributes[i].name))
          continue;

        const name = Utilities.kebabCaseToCamelCase(el.attributes[i].name.replace('data-', ''));
        returnValue[name] = Utilities.parseStringToType(el.attributes[i].value);
      }
    }

    return returnValue;
  }

  static getMinCssWidth(el: HTMLElement): number | null {
    const computedStyle = el.ownerDocument.defaultView?.getComputedStyle(el).minWidth;
    const minWidth = Utilities.parseStyleDimension(computedStyle, true);
    if (typeof minWidth === 'number' && !isNaN(minWidth))
      return minWidth;

    return null;
  }

  static getMaxCssWidth(el: HTMLElement): number | null {
    const computedStyle = el.ownerDocument.defaultView?.getComputedStyle(el).maxWidth;
    const maxWidth = Utilities.parseStyleDimension(computedStyle, true);
    if (typeof maxWidth === 'number' && !isNaN(maxWidth))
      return maxWidth;

    return null;
  }

  static getOuterWidth(el: HTMLElement, includeMargin: boolean = false): number {
    //TODO: Browser test this
    const width = el.offsetWidth;
    if (!includeMargin)
      return width;

    const computedStyles = el.ownerDocument.defaultView?.getComputedStyle(el);
    const marginTop = <number>Utilities.parseStyleDimension(computedStyles?.marginTop, false);
    const marginBottom = <number>Utilities.parseStyleDimension(computedStyles?.marginBottom, false);
    return width + marginTop + marginBottom;
  }

  static getInnerWidth(el: HTMLElement): number {
    //TODO: Browser test this
    const width = UtilitiesDOM.getOuterWidth(el);

    const computedStyles = el.ownerDocument.defaultView?.getComputedStyle(el);
    const borderLeft = <number>Utilities.parseStyleDimension(computedStyles?.borderLeft, false);
    const borderRight = <number>Utilities.parseStyleDimension(computedStyles?.borderRight, false);

    return width - borderLeft - borderRight;
  }

  static getWidth(el: HTMLElement): number {
    //TODO: Browser test this
    const width = UtilitiesDOM.getOuterWidth(el);

    const computedStyles = el.ownerDocument.defaultView?.getComputedStyle(el);
    const isBorderBox = computedStyles?.boxSizing === 'border-box';
    if (isBorderBox)
      return width;

    const paddingLeft = <number>Utilities.parseStyleDimension(computedStyles?.paddingLeft, false);
    const paddingRight = <number>Utilities.parseStyleDimension(computedStyles?.paddingRight, false);
    const borderLeft = <number>Utilities.parseStyleDimension(computedStyles?.borderLeft, false);
    const borderRight = <number>Utilities.parseStyleDimension(computedStyles?.borderRight, false);


    return width - paddingLeft - paddingRight - borderLeft - borderRight;
  }

  static getOuterHeight(el: HTMLElement, includeMargin: boolean = false): number {
    //TODO: Browser test this
    const height = el.offsetHeight;
    if (!includeMargin)
      return height;

    const computedStyles = el.ownerDocument.defaultView?.getComputedStyle(el);
    const marginTop = <number>Utilities.parseStyleDimension(computedStyles?.marginTop, false);
    const marginBottom = <number>Utilities.parseStyleDimension(computedStyles?.marginBottom, false);
    return height + marginTop + marginBottom;
  }

  static getInnerHeight(el: HTMLElement): number {
    //TODO: Browser test this
    const height = UtilitiesDOM.getOuterHeight(el);

    const computedStyles = el.ownerDocument.defaultView?.getComputedStyle(el);
    const borderTop = <number>Utilities.parseStyleDimension(computedStyles?.borderTop, false);
    const borderBottom = <number>Utilities.parseStyleDimension(computedStyles?.borderBottom, false);

    return height - borderTop - borderBottom;
  }

  static getHeight(el: HTMLElement): number {
    //TODO: Browser test this
    const height = UtilitiesDOM.getOuterHeight(el);

    const computedStyles = el.ownerDocument.defaultView?.getComputedStyle(el);
    const paddingTop = <number>Utilities.parseStyleDimension(computedStyles?.paddingTop, false);
    const paddingBottom = <number>Utilities.parseStyleDimension(computedStyles?.paddingBottom, false);
    const borderTop = <number>Utilities.parseStyleDimension(computedStyles?.borderTop, false);
    const borderBottom = <number>Utilities.parseStyleDimension(computedStyles?.borderBottom, false);

    return height - paddingTop - paddingBottom - borderTop - borderBottom;
  }

  static getOffset(el: HTMLElement): { top: number, left: number } {
    if (!el)
      return { top: 0, left: 0 };

    const rect = el.getBoundingClientRect();

    return {
      top: rect.top + el.ownerDocument.body.scrollTop,
      left: rect.left + el.ownerDocument.body.scrollLeft
    }
  }

  static matches(el: Element, selector: string): boolean {
    let matchesFn: any = undefined;
    // find vendor prefix
    const matchNames = ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'];
    for (let index = 0; index < matchNames.length; index++) {
      if (typeof (el.ownerDocument.body as any)[matchNames[index]] === 'function') {
        matchesFn = matchNames[index];
        break;
      }
    }

    return matchesFn ? (el as any)[matchesFn](selector) : false;
  }

  static closest(el: Element, selector: string): Element | null {
    if (!el)
      return null;

    if (typeof el.closest === 'function')
      return el.closest(selector);

    let element: Node = el;

    while (element && element.nodeType === 1) {
      if (UtilitiesDOM.matches(<Element>element, selector)) {
        return <Element>element;
      }
      element = element.parentNode as Node;
    }

    return null;
  }

  static getPointerX(event: Event): number | null {
    //TODO: Browser test this
    if (event.type.indexOf('touch') === 0) {
      const tEvent = event as TouchEvent;
      if (tEvent.touches && tEvent.touches.length) {
        return tEvent.touches[0].pageX;
      }

      if (tEvent.changedTouches && tEvent.changedTouches.length) {
        return tEvent.changedTouches[0].pageX
      }
    }
    return (event as MouseEvent).pageX;
  }

  static getTextWidth(contentElement: HTMLElement, measurementElement: HTMLElement): number {
    //TODO: Browser test this
    if (!contentElement || !measurementElement)
      return 0;

    var text = contentElement.textContent?.trim().replace(/\s/g, '&nbsp;') + '&nbsp;'; //add extra space to ensure we are not elipsing anything

    const styles = contentElement.ownerDocument.defaultView?.getComputedStyle(contentElement);
    ['fontFamily', 'fontSize', 'fontWeight', 'padding', 'border', 'boxSizing']
      .forEach((prop) => {
        (measurementElement.style as any)[prop] = (styles as any)[prop];
      });

    measurementElement.innerHTML = text;
    return UtilitiesDOM.getOuterWidth(measurementElement, true);
  }
}
