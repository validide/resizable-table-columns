import { beforeAll, describe, expect, it } from "vitest";
import { UtilitiesDOM } from "../sources/ts/utilities-dom";

describe("UtilitiesDOM", () => {
  beforeAll(() => {
    document.body.innerHTML = `<span id="closest-test" class="closest-test-class"></span>`;
    document.body.setAttribute("data-test-value-one", "one");
    document.body.setAttribute("data-test-value-two", "two");
  });

  describe(".getDataAttributesValues", () => {
    it('Should be "null" if not element is provided', () => {
      const dataValues = UtilitiesDOM.getDataAttributesValues();
      expect(dataValues).toBeNull();
    });

    it("Should return data attributes", () => {
      const dataValues = UtilitiesDOM.getDataAttributesValues(document.body);

      if (dataValues === null) {
        throw new Error("dataValues should not be null");
      }

      expect(Object.hasOwn(dataValues, "testValueOne")).toBe(true);
      expect(Object.hasOwn(dataValues, "testValueTwo")).toBe(true);
      expect(Object.hasOwn(dataValues, "testValueMissing")).toBe(false);
      expect(dataValues.testValueOne).toBe("one");
      expect(dataValues.testValueTwo).toBe("two");
    });
  });
});
