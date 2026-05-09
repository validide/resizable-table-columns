import { describe, expect, it } from "vitest";
import { Utilities } from "../sources/ts/utilities";

describe("Utilities", () => {
  describe(".kebabCaseToCamelCase", () => {
    it('Should change "kebab-case" to "kebabCase"', () => {
      expect(Utilities.kebabCaseToCamelCase("kebab-case")).toBe("kebabCase");
    });
  });

  describe(".parseStringToType", () => {
    it("Should be string for empty", () => {
      const tesString = "";
      const result = Utilities.parseStringToType(tesString);
      expect(result).toBeTypeOf("string");
      expect(result).toBe(result);
    });

    it("Should be string for whitespace", () => {
      const tesString = " \n\r\t";
      const result = Utilities.parseStringToType(tesString);
      expect(result).toBeTypeOf("string");
      expect(result).toBe(tesString);
    });

    it("Should be string", () => {
      const tesString = "some test 12 .34 \r \t \n some more";
      const result = Utilities.parseStringToType(tesString);
      expect(result).toBeTypeOf("string");
      expect(result).toBe(tesString);
    });

    it('Should be string for "10px"', () => {
      const tesString = "10px";
      const result = Utilities.parseStringToType(tesString);
      expect(result).toBeTypeOf("string");
      expect(result).toBe(tesString);
    });

    it('Should be string for "1.2.3"', () => {
      const tesString = "1.2.3";
      const result = Utilities.parseStringToType(tesString);
      expect(result).toBeTypeOf("string");
      expect(result).toBe(tesString);
    });

    it('Should be string for "10e"', () => {
      const tesString = "10e";
      const result = Utilities.parseStringToType(tesString);
      expect(result).toBeTypeOf("string");
      expect(result).toBe(tesString);
    });

    it('Should be boolen "true"', () => {
      const result = Utilities.parseStringToType("tRue");
      expect(result).toBeTypeOf("boolean");
      expect(result).toBe(true);
    });

    it('Should be boolen "false"', () => {
      const result = Utilities.parseStringToType("FaLsE");
      expect(result).toBeTypeOf("boolean");
      expect(result).toBe(false);
    });

    it('Should be number "-1"', () => {
      const result = Utilities.parseStringToType("-1");
      expect(result).toBeTypeOf("number");
      expect(result).toBe(-1);
    });

    it('Should be number "1"', () => {
      const result = Utilities.parseStringToType("1");
      expect(result).toBeTypeOf("number");
      expect(result).toBe(1);
    });

    it('Should be number ".1"', () => {
      const result = Utilities.parseStringToType(".1");
      expect(result).toBeTypeOf("number");
      expect(result).toBe(0.1);
    });

    it('Should be number "-.1"', () => {
      const result = Utilities.parseStringToType("-.1");
      expect(result).toBeTypeOf("number");
      expect(result).toBe(-0.1);
    });

    it('Should be number "0.1"', () => {
      const result = Utilities.parseStringToType("0.1");
      expect(result).toBeTypeOf("number");
      expect(result).toBe(0.1);
    });

    it('Should be number "-0.1"', () => {
      const result = Utilities.parseStringToType("-0.1");
      expect(result).toBeTypeOf("number");
      expect(result).toBe(-0.1);
    });

    it('Should be number "1e+30"', () => {
      const result = Utilities.parseStringToType("1e+30");
      expect(result).toBeTypeOf("number");
      expect(result).toBe(1e30);
    });

    it('Should be number "Infinity"', () => {
      const result = Utilities.parseStringToType("Infinity");
      expect(result).toBeTypeOf("number");
      expect(result).toBe(Infinity);
    });

    it('Should be number "-Infinity"', () => {
      const result = Utilities.parseStringToType("-Infinity");
      expect(result).toBeTypeOf("number");
      expect(result).toBe(-Infinity);
    });
  });
});
