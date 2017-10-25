export default class Utilities {
  static regexEscapeRegex: RegExp = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
  static kebabCaseRegex: RegExp = /(\-\w)/g;
  static trueRegex: RegExp = /^true$/i;
  static falseRegex: RegExp = /^false$/i;
  static onlyWhiteSpace: RegExp = /^\s$/;
  static notEmptyOrWhiteSpace: RegExp = /\S/;


  static escapeRegExp(str: string) {
    return str.replace(Utilities.regexEscapeRegex, "\\$&");
  }

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

  static parseStyleDimension(dimension: string | number, returnOriginal: boolean): number | string {
    if (typeof dimension === 'string') {
      if (dimension.length) {
        const toParse = dimension
          .replace('px', '')
          .replace(',', '.');
        const parsed = parseFloat(toParse);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
    }
    else if (typeof dimension === 'number') {
      return dimension;
    }

    if (returnOriginal) {
      return dimension;
    } else {
      return 0;
    }
  }
}
