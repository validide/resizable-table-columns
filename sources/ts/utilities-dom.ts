import Utilities from './utilities'

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

  static getDataAttributesValues(el: HTMLElement): object {
    if (!el)
      return null;

    const returnValue: object = {};
    if (el.dataset) {
      for (let prop in el.dataset) {
        if (el.dataset.hasOwnProperty(prop)) {
          returnValue[prop] = Utilities.parseStringToType(el.dataset[prop]);
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
    const computedStyle = el.ownerDocument.defaultView.getComputedStyle(el).minWidth;
    const minWidth = Utilities.parseStyleDimension(computedStyle, true);
    if (typeof minWidth === 'number' && !isNaN(minWidth))
      return minWidth;

    return null;
  }

  static getMaxCssWidth(el: HTMLElement): number | null {
    const computedStyle = el.ownerDocument.defaultView.getComputedStyle(el).maxWidth;
    const maxWidth = Utilities.parseStyleDimension(computedStyle, true);
    if (typeof maxWidth === 'number' && !isNaN(maxWidth))
      return maxWidth;

    return null;
  }

  static getOuterWidth(el: HTMLElement, includeMargin: boolean = false): number {
    //TODO: Unit test this
    const width = el.offsetWidth;
    if (!includeMargin)
      return width;

    const computedStyles = el.ownerDocument.defaultView.getComputedStyle(el);
    const marginTop = <number>Utilities.parseStyleDimension(computedStyles.marginTop, false);
    const marginBottom = <number>Utilities.parseStyleDimension(computedStyles.marginBottom, false);
    return width + marginTop + marginBottom;
  }

  static getInnerWidth(el: HTMLElement): number | null {
    //TODO: Unit test this
    const width = UtilitiesDOM.getOuterWidth(el);

    const computedStyles = el.ownerDocument.defaultView.getComputedStyle(el);
    const borderLeft = <number>Utilities.parseStyleDimension(computedStyles.borderLeft, false);
    const borderRight = <number>Utilities.parseStyleDimension(computedStyles.borderRight, false);

    return width - borderLeft - borderRight;
  }

  static getWidth(el: HTMLElement): number | null {
    //TODO: Unit test this
    const width = UtilitiesDOM.getOuterWidth(el);

    const computedStyles = el.ownerDocument.defaultView.getComputedStyle(el);
    const paddingLeft = <number>Utilities.parseStyleDimension(computedStyles.paddingLeft, false);
    const paddingRight = <number>Utilities.parseStyleDimension(computedStyles.paddingRight, false);
    const borderLeft = <number>Utilities.parseStyleDimension(computedStyles.borderLeft, false);
    const borderRight = <number>Utilities.parseStyleDimension(computedStyles.borderRight, false);

    return width - paddingLeft - paddingRight - borderLeft - borderRight;
  }

  static getOuterHeight(el: HTMLElement, includeMargin: boolean = false): number {
    //TODO: Unit test this
    const height = el.offsetHeight;
    if (!includeMargin)
      return height;

    const computedStyles = el.ownerDocument.defaultView.getComputedStyle(el);
    const marginTop = <number>Utilities.parseStyleDimension(computedStyles.marginTop, false);
    const marginBottom = <number>Utilities.parseStyleDimension(computedStyles.marginBottom, false);
    return height + marginTop + marginBottom;
  }

  static getInnerHeight(el: HTMLElement): number | null {
    //TODO: Unit test this
    const height = UtilitiesDOM.getOuterHeight(el);

    const computedStyles = el.ownerDocument.defaultView.getComputedStyle(el);
    const borderTop = <number>Utilities.parseStyleDimension(computedStyles.borderTop, false);
    const borderBottom = <number>Utilities.parseStyleDimension(computedStyles.borderBottom, false);

    return height - borderTop - borderBottom;
  }

  static getHeight(el: HTMLElement): number | null {
    //TODO: Unit test this
    const height = UtilitiesDOM.getOuterHeight(el);

    const computedStyles = el.ownerDocument.defaultView.getComputedStyle(el);
    const paddingTop = <number>Utilities.parseStyleDimension(computedStyles.paddingTop, false);
    const paddingBottom = <number>Utilities.parseStyleDimension(computedStyles.paddingBottom, false);
    const borderTop = <number>Utilities.parseStyleDimension(computedStyles.borderTop, false);
    const borderBottom = <number>Utilities.parseStyleDimension(computedStyles.borderBottom, false);

    return height - paddingTop - paddingBottom - borderTop - borderBottom;
  }

  static getOffset(el: HTMLElement): { top: number, left: number } {
    //TODO: Unit test this}
    const rect = el.getBoundingClientRect();

    return {
      top: rect.top + el.ownerDocument.body.scrollTop,
      left: rect.left + el.ownerDocument.body.scrollLeft
    }
  }
}
