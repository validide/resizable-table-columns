export default class Utilities {
  static escapeRegExp(str: string) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  static kebabCaseToCamelCase(str: string) {
    return str.replace(/(\-\w)/g, function(m) { return m[1].toUpperCase(); });
  }
}
