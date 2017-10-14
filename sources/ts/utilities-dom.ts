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
}
