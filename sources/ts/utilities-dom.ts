import { IIndexedCollection, Utilities } from './utilities'

export class UtilitiesDOM {
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
}
