import Utilities from './utilities'

export default class UtilitiesDOM {
  addClass(el: HTMLElement, className: string) {
    if (el.classList)
      el.classList.add(className)
    else if (!this.hasClass(el, className))
      el.className += " " + className
  }

  removeClass(el: HTMLElement, className: string) {
    if (el.classList)
      el.classList.remove(className)
    else if (this.hasClass(el, className)) {
      var reg = new RegExp('(\\s|^)' + Utilities.escapeRegExp(className) + '(\\s|$)')
      el.className = el.className.replace(reg, ' ')
    }
  }

  hasClass(el: HTMLElement, className: string) {
    if (el.classList)
      return el.classList.contains(className)
    else
      return !!el.className.match(new RegExp('(\\s|^)' + Utilities.escapeRegExp(className) + '(\\s|$)'))
  }
}
