var Utilities = (function () {
    function Utilities() {
    }
    Utilities.escapeRegExp = function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };
    return Utilities;
}());
export default Utilities;
