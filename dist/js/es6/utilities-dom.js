import { Utilities } from './utilities';
var UtilitiesDOM = /** @class */ (function () {
    function UtilitiesDOM() {
    }
    UtilitiesDOM.getDataAttributesValues = function (el) {
        if (!el)
            return null;
        var returnValue = {};
        if (el.dataset) {
            for (var prop in el.dataset) {
                if (el.dataset.hasOwnProperty(prop)) {
                    returnValue[prop] = Utilities.parseStringToType(el.dataset[prop] || '');
                }
            }
        }
        else {
            for (var i = 0; i < el.attributes.length; i++) {
                if (!/^data\-/.test(el.attributes[i].name))
                    continue;
                var name_1 = Utilities.kebabCaseToCamelCase(el.attributes[i].name.replace('data-', ''));
                returnValue[name_1] = Utilities.parseStringToType(el.attributes[i].value);
            }
        }
        return returnValue;
    };
    return UtilitiesDOM;
}());
export { UtilitiesDOM };
//# sourceMappingURL=utilities-dom.js.map