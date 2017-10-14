var Utilities = (function () {
    function Utilities() {
    }
    Utilities.escapeRegExp = function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };
    Utilities.kebabCaseToCamelCase = function (str) {
        return str.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
    };
    return Utilities;
}());
export default Utilities;
