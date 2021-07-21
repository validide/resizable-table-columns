export interface IIndexedCollection<T> {
  [name: string]: T;
}

export class Utilities {
  static regexEscapeRegex: RegExp = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
  static kebabCaseRegex: RegExp = /(\-\w)/g;
  static trueRegex: RegExp = /^true$/i;
  static falseRegex: RegExp = /^false$/i;
  static onlyWhiteSpace: RegExp = /^\s$/;
  static notEmptyOrWhiteSpace: RegExp = /\S/;

  static kebabCaseToCamelCase(str: string) {
    return str.replace(Utilities.kebabCaseRegex, function (m) { return m[1].toUpperCase(); });
  }

  static parseStringToType(str: string): any {
    if (str.length == 0 || Utilities.onlyWhiteSpace.test(str))
      return str;

    if (Utilities.trueRegex.test(str))
      return true;

    if (Utilities.falseRegex.test(str))
      return false;

    if (Utilities.notEmptyOrWhiteSpace.test(str)) {
      const temp = +str;
      if (!isNaN(temp))
        return temp;
    }
    return str;
  }
}
