export interface IIndexedCollection<T> {
  [name: string]: T;
}

export const Utilities = {
  regexEscapeRegex: /[-[\]/{}()*+?.\\^$|]/g,
  kebabCaseRegex: /(-\w)/g,
  trueRegex: /^true$/i,
  falseRegex: /^false$/i,
  onlyWhiteSpace: /^\s$/,
  notEmptyOrWhiteSpace: /\S/,

  kebabCaseToCamelCase(str: string): string {
    return str.replace(Utilities.kebabCaseRegex, (m) => m[1].toUpperCase());
  },

  parseStringToType(str: string): string | number | boolean {
    if (str.length === 0 || Utilities.onlyWhiteSpace.test(str)) return str;

    if (Utilities.trueRegex.test(str)) return true;

    if (Utilities.falseRegex.test(str)) return false;

    if (Utilities.notEmptyOrWhiteSpace.test(str)) {
      const temp = +str;
      if (!Number.isNaN(temp)) return temp;
    }
    return str;
  },
};
