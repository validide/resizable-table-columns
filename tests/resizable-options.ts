import { beforeAll, describe, expect, it } from "vitest";
import { type IStore, ResizableOptions } from "../sources/ts/resizable-options";

describe("ResizableOptions", () => {
  beforeAll(() => {
    document.body.innerHTML = `<table id="the-table"
      data-min-width="-10"
      data-max-width="213"
      data-resize-from-body="true"
      ><tbody><tr><td><td></tr></tbody></table>`;
  });

  describe(".constructor", () => {
    it("No params", () => {
      const opts = new ResizableOptions();
      expect(opts).toBeTypeOf("object");
      expect(opts).not.toBeNull();
    });

    it('With "options" argument', () => {
      const store = {};
      const defaultOpts = new ResizableOptions();
      defaultOpts.store = store as unknown as IStore;
      defaultOpts.maxWidth = Math.random();

      const opts = new ResizableOptions(defaultOpts);

      expect(opts).toBeTypeOf("object");
      expect(opts).not.toBeNull();
      expect(defaultOpts.store).toEqual(opts.store);
      expect(defaultOpts.maxWidth).toBe(opts.maxWidth);
    });

    it('With "element" argument', () => {
      const el = document.getElementById("the-table");
      expect(el).not.toBeNull();

      const opts = new ResizableOptions(null, el);

      expect(opts).toBeTypeOf("object");
      expect(opts).not.toBeNull();
      expect(opts.resizeFromBody).toBe(true);
      expect(opts.maxWidth).toBeTypeOf("number");
      expect(opts.maxWidth).toBe(213);
    });

    it('With "options" and "element" arguments', () => {
      const defaultOpts = new ResizableOptions();
      defaultOpts.store = null;
      defaultOpts.maxWidth = 2000;

      const el = document.getElementById("the-table");
      expect(el).not.toBeNull();

      const opts = new ResizableOptions(defaultOpts, el);

      expect(opts).toBeTypeOf("object");
      expect(opts).not.toBeNull();
      expect(opts.resizeFromBody).toBe(true);
      expect(opts.maxWidth).toBeTypeOf("number");
      expect(opts.maxWidth).toBe(213);
    });
  });

  describe(".overrideValues", () => {
    it("Should not fail when called with no params", () => {
      const opts = new ResizableOptions();
      opts.overrideValues();
      expect(opts.minWidth).toBe(opts.minWidth);
    });

    it("Should not fail when called with null param", () => {
      const opts = new ResizableOptions();
      opts.overrideValues(null);
      expect(opts.minWidth).toBe(opts.minWidth);
    });

    it("Should override values", () => {
      const opts = new ResizableOptions();
      const obj = { minWidth: -10 };
      opts.overrideValues(obj);
      expect(obj.minWidth).toBe(opts.minWidth);
    });
  });

  describe(".overrideValuesFromElement", () => {
    it("Should not fail when called with no params", () => {
      const opts = new ResizableOptions();
      opts.overrideValuesFromElement();
      expect(opts.minWidth).toBe(opts.minWidth);
    });

    it("Should not fail when called with null param", () => {
      const opts = new ResizableOptions();
      opts.overrideValuesFromElement(null);
      expect(opts.minWidth).toBe(opts.minWidth);
    });

    it("Should override values", () => {
      const opts = new ResizableOptions();
      const el = document.getElementById("the-table");
      expect(el).not.toBeNull();

      opts.overrideValuesFromElement(el);
      expect(opts.minWidth).toBe(-10);
      expect(opts.resizeFromBody).toBe(true);
      expect(opts.maxWidth).toBeTypeOf("number");
      expect(opts.maxWidth).toBe(213);
    });
  });
});
