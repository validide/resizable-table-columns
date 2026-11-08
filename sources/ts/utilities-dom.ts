import { Utilities } from "./utilities";

export const UtilitiesDOM = {
  getDataAttributesValues(el?: HTMLElement): Record<string, string | number | boolean> | null {
    if (!el) return null;

    const returnValue: Record<string, string | number | boolean> = {};
    if (el.dataset) {
      for (const [prop, value] of Object.entries(el.dataset)) {
        returnValue[prop] = Utilities.parseStringToType(value ?? "");
      }
    } else {
      for (const attr of Array.from(el.attributes)) {
        if (!attr.name.startsWith("data-")) continue;

        const name = Utilities.kebabCaseToCamelCase(attr.name.slice("data-".length));
        returnValue[name] = Utilities.parseStringToType(attr.value);
      }
    }

    return returnValue;
  },
};
