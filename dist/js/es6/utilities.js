var Utilities = /** @class */ (function () {
    function Utilities() {
    }
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
    Utilities.regexEscapeRegex = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
    Utilities.kebabCaseRegex = /(\-\w)/g;
    Utilities.trueRegex = /^true$/i;
    Utilities.falseRegex = /^false$/i;
    Utilities.onlyWhiteSpace = /^\s$/;
    Utilities.notEmptyOrWhiteSpace = /\S/;
    return Utilities;
}());
export { Utilities };
//# sourceMappingURL=utilities.js.map