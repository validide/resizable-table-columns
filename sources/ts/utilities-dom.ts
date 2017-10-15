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
      for (let i=0; i < el.attributes.length; i++) {
        if (!/^data\-/.test(el.attributes[i].name))
          continue;

        const name = Utilities.kebabCaseToCamelCase(el.attributes[i].name.replace('data-', ''));
        returnValue[name] = Utilities.parseStringToType(el.attributes[i].value);
      }
    }

    return returnValue;
  }
}
