import { Utilities } from "./utilities";
export const UtilitiesDOM = {
    getDataAttributesValues(el) {
        if (!el)
            return null;
        const returnValue = {};
        if (el.dataset) {
            for (const prop in el.dataset) {
                if (Object.hasOwn(el.dataset, prop)) {
                    returnValue[prop] = Utilities.parseStringToType(el.dataset[prop] || "");
                }
            }
        }
        else {
            for (let i = 0; i < el.attributes.length; i++) {
                if (!/^data-/.test(el.attributes[i].name))
                    continue;
                const name = Utilities.kebabCaseToCamelCase(el.attributes[i].name.replace("data-", ""));
                returnValue[name] = Utilities.parseStringToType(el.attributes[i].value);
            }
        }
        return returnValue;
    },
};
//# sourceMappingURL=utilities-dom.js.map