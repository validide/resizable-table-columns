var Utilities = /** @class */ (function () {
    function Utilities() {
    }
    Utilities.escapeRegExp = function (str) {
        return str.replace(Utilities.regexEscapeRegex, "\\$&");
    };
    Utilities.kebabCaseToCamelCase = function (str) {
        return str.replace(Utilities.kebabCaseRegex, function (m) { return m[1].toUpperCase(); });
    };
    Utilities.parseStringToType = function (str) {
        if (str.length == 0 || Utilities.onlyWhiteSpace.test(str))
            return str;
        if (Utilities.trueRegex.test(str))
            return true;
        if (Utilities.falseRegex.test(str))
            return false;
        if (Utilities.notEmptyOrWhiteSpace.test(str)) {
            var temp = +str;
            if (!isNaN(temp))
                return temp;
        }
        return str;
    };
    Utilities.parseStyleDimension = function (dimension, returnOriginal) {
        if (typeof dimension === 'string') {
            if (dimension.length) {
                var toParse = dimension
                    .replace('px', '')
                    .replace(',', '.');
                var parsed = parseFloat(toParse);
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
        }
        else {
            return 0;
        }
    };
    Utilities.regexEscapeRegex = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
    Utilities.kebabCaseRegex = /(\-\w)/g;
    Utilities.trueRegex = /^true$/i;
    Utilities.falseRegex = /^false$/i;
    Utilities.onlyWhiteSpace = /^\s$/;
    Utilities.notEmptyOrWhiteSpace = /\S/;
    return Utilities;
}());
export default Utilities;
//# sourceMappingURL=utilities.js.map