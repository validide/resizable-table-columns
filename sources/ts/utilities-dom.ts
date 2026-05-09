import { Utilities } from "./utilities";

export const UtilitiesDOM = {
  getDataAttributesValues(el?: HTMLElement): Record<string, string | number | boolean> | null {
    if (!el) return null;

    const returnValue: Record<string, string | number | boolean> = {};
    if (el.dataset) {
      for (const prop in el.dataset) {
        if (Object.hasOwn(el.dataset, prop)) {
          returnValue[prop] = Utilities.parseStringToType(el.dataset[prop] || "");
        }
      }
    } else {
      for (let i = 0; i < el.attributes.length; i++) {
        if (!/^data-/.test(el.attributes[i].name)) continue;

        const name = Utilities.kebabCaseToCamelCase(el.attributes[i].name.replace("data-", ""));
        returnValue[name] = Utilities.parseStringToType(el.attributes[i].value);
      }
    }

    return returnValue;
  },
};
