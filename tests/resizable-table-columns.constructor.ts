import { beforeAll, describe, expect, it } from "vitest";
import { ResizableConstants } from "../sources/ts/resizable-constants";
import { ResizableTableColumns } from "../sources/ts/resizable-table-columns";

describe("ResizableTableColumns", () => {
  describe("constructor", () => {
    beforeAll(() => {
      document.body.innerHTML = `
        <table id="valid-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Counrty</th>
              <th>Region</th>
              <th>City</th>
              <th>Street</th>
              <th>Post Code</th>
              <th>Last updated</th>
              <th>UUID</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>10</td>
              <td>Alexander</td>
              <td>Fiji</td>
              <td>Istanbul</td>
              <td>Istanbul</td>
              <td>P.O. Box 879, 3462 Diam. St.</td>
              <td>JS5Z 4UZ</td>
              <td>2016-10-03T23:00:32-07:00</td>
              <td>F854BE7E-C117-7B9A-F3D5-9EAD294315D0</td>
            </tr>
          </tbody>
        </table>
        <table id="missing-head-and-body">
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Counrty</th>
              <th>Region</th>
              <th>City</th>
              <th>Street</th>
              <th>Post Code</th>
              <th>Last updated</th>
              <th>UUID</th>
            </tr>
            <tr>
              <td>10</td>
              <td>Alexander</td>
              <td>Fiji</td>
              <td>Istanbul</td>
              <td>Istanbul</td>
              <td>P.O. Box 879, 3462 Diam. St.</td>
              <td>JS5Z 4UZ</td>
              <td>2016-10-03T23:00:32-07:00</td>
              <td>F854BE7E-C117-7B9A-F3D5-9EAD294315D0</td>
            </tr>
        </table>
        <table id="missing-head-and-body-2">
        </table>
        <table id="missing-body">
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Counrty</th>
              <th>Region</th>
              <th>City</th>
              <th>Street</th>
              <th>Post Code</th>
              <th>Last updated</th>
              <th>UUID</th>
            </tr>
          </thead>
        </table>
        <table id="missing-head">
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Counrty</th>
              <th>Region</th>
              <th>City</th>
              <th>Street</th>
              <th>Post Code</th>
              <th>Last updated</th>
              <th>UUID</th>
            </tr>
          <tbody>
            <tr>
              <td>10</td>
              <td>Alexander</td>
              <td>Fiji</td>
              <td>Istanbul</td>
              <td>Istanbul</td>
              <td>P.O. Box 879, 3462 Diam. St.</td>
              <td>JS5Z 4UZ</td>
              <td>2016-10-03T23:00:32-07:00</td>
              <td>F854BE7E-C117-7B9A-F3D5-9EAD294315D0</td>
            </tr>
          </tbody>
        </table>
        <table id="double-head">
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Counrty</th>
              <th>Region</th>
              <th>City</th>
              <th>Street</th>
              <th>Post Code</th>
              <th>Last updated</th>
              <th>UUID</th>
            </tr>
          </thead>
          <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Counrty</th>
            <th>Region</th>
            <th>City</th>
            <th>Street</th>
            <th>Post Code</th>
            <th>Last updated</th>
            <th>UUID</th>
          </tr>
        </thead>
        <tbody>
            <tr>
              <td>10</td>
              <td>Alexander</td>
              <td>Fiji</td>
              <td>Istanbul</td>
              <td>Istanbul</td>
              <td>P.O. Box 879, 3462 Diam. St.</td>
              <td>JS5Z 4UZ</td>
              <td>2016-10-03T23:00:32-07:00</td>
              <td>F854BE7E-C117-7B9A-F3D5-9EAD294315D0</td>
            </tr>
          </tbody>
        </table>
        <table id="double-body">
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Counrty</th>
              <th>Region</th>
              <th>City</th>
              <th>Street</th>
              <th>Post Code</th>
              <th>Last updated</th>
              <th>UUID</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>10</td>
              <td>Alexander</td>
              <td>Fiji</td>
              <td>Istanbul</td>
              <td>Istanbul</td>
              <td>P.O. Box 879, 3462 Diam. St.</td>
              <td>JS5Z 4UZ</td>
              <td>2016-10-03T23:00:32-07:00</td>
              <td>F854BE7E-C117-7B9A-F3D5-9EAD294315D0</td>
            </tr>
          </tbody>
          <tbody>
          <tr>
            <td>10</td>
            <td>Alexander</td>
            <td>Fiji</td>
            <td>Istanbul</td>
            <td>Istanbul</td>
            <td>P.O. Box 879, 3462 Diam. St.</td>
            <td>JS5Z 4UZ</td>
            <td>2016-10-03T23:00:32-07:00</td>
            <td>F854BE7E-C117-7B9A-F3D5-9EAD294315D0</td>
          </tr>
        </tbody>
        </table>
        <table id="invalid-header">
          <thead>
            <tr>
              <th></th>
              <td></td>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <table id="invalid-header2">
          <thead>
            <tr>
              <td></td>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <table id="invalid-header3">
          <thead>
            <tr></tr>
          </thead>
          <tbody></tbody>
        </table>
        <table id="invalid-header4">
          <thead></thead>
          <tbody></tbody>
        </table>`;
    });

    it("Should construct the object", () => {
      const el = document.getElementById("valid-table");
      expect(el).not.toBeNull();

      const rtc = new ResizableTableColumns(el as HTMLTableElement, null);

      expect(rtc).toBeTypeOf("object");
      expect((el as unknown as Record<string, unknown>)[ResizableConstants.dataPropertyName]).toBeTypeOf("object");
      expect(rtc).toEqual((el as unknown as Record<string, unknown>)[ResizableConstants.dataPropertyName]);
    });

    it("Should fail to construct - undefined table ", () => {
      let theError = "";
      try {
        const _rtc = new ResizableTableColumns(void 0 as unknown as HTMLTableElement, null);
      } catch (error) {
        theError = error as string;
      }

      expect(theError.length > 0).toBe(true);
      expect(theError.indexOf('Invalid argument: "table".')).toBe(0);
    });

    it("Should fail to construct - null table ", () => {
      let theError = "";
      try {
        const _rtc = new ResizableTableColumns(null as unknown as HTMLTableElement, null);
      } catch (error) {
        theError = error as string;
      }

      expect(theError.length > 0).toBe(true);
      expect(theError.indexOf('Invalid argument: "table".')).toBe(0);
    });

    it("Should fail to construct - plain object table ", () => {
      let theError = "";
      try {
        const _rtc = new ResizableTableColumns({} as unknown as HTMLTableElement, null);
      } catch (error) {
        theError = error as string;
      }

      expect(theError.length > 0).toBe(true);
      expect(theError.indexOf('Invalid argument: "table".')).toBe(0);
    });

    it("Should fail to construct - plain HTMLTableElement table ", () => {
      let theError = "";
      const el = document.createElement("table");

      try {
        (el as unknown as Record<string, unknown>)[ResizableConstants.dataPropertyName] = {};
        const _rtc = new ResizableTableColumns(el, null);
      } catch (error) {
        theError = error as string;
      }

      expect(theError.length > 0).toBe(true);
      expect(theError.indexOf(`Existing "${ResizableConstants.dataPropertyName}" property.`)).toBe(0);
    });

    it("Should fail to construct - missing head and body", () => {
      let theError = "";

      try {
        const el = document.getElementById("missing-head-and-body");
        expect(el).not.toBeNull();

        const _rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error as string;
      }

      expect(theError.length > 0).toBe(true);
      expect(theError.indexOf("Markup validation: thead count")).toBe(0);
    });

    it("Should fail to construct - missing head and body 2", () => {
      let theError = "";

      try {
        const el = document.getElementById("missing-head-and-body-2");
        expect(el).not.toBeNull();

        const _rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error as string;
      }

      expect(theError.length > 0).toBe(true);
      expect(theError.indexOf("Markup validation: thead count")).toBe(0);
    });

    it("Should fail to construct - missing head", () => {
      let theError = "";

      try {
        const el = document.getElementById("missing-head");
        expect(el).not.toBeNull();

        const _rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error as string;
      }

      expect(theError.length > 0).toBe(true);
      expect(theError.indexOf("Markup validation: thead count")).toBe(0);
    });

    it("Should fail to construct - missing body", () => {
      let theError = "";

      try {
        const el = document.getElementById("missing-body");
        expect(el).not.toBeNull();

        const _rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error as string;
      }

      expect(theError.length > 0).toBe(true);
      expect(theError.indexOf("Markup validation: tbody count")).toBe(0);
    });

    it("Should fail to construct - multiple heads", () => {
      let theError = "";

      try {
        const el = document.getElementById("double-head");
        expect(el).not.toBeNull();

        const _rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error as string;
      }

      expect(theError.length > 0).toBe(true);
      expect(theError.indexOf("Markup validation: thead count")).toBe(0);
    });

    it("Should fail to construct - multiple bodies", () => {
      let theError = "";

      try {
        const el = document.getElementById("double-body");
        expect(el).not.toBeNull();

        const _rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error as string;
      }

      expect(theError.length > 0).toBe(true);
      expect(theError.indexOf("Markup validation: tbody count")).toBe(0);
    });

    it("Should fail to construct - invalid header", () => {
      let theError = "";

      try {
        const el = document.getElementById("invalid-header");
        expect(el).not.toBeNull();

        const _rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error as string;
      }

      expect(theError.length > 0).toBe(true);
      expect(theError.indexOf("Markup validation: thead first row invalid")).toBe(0);
    });

    it("Should fail to construct - invalid header 2", () => {
      let theError = "";

      try {
        const el = document.getElementById("invalid-header2");
        expect(el).not.toBeNull();

        const _rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error as string;
      }

      expect(theError.length > 0).toBe(true);
      expect(theError.indexOf("Markup validation: thead first row cells count")).toBe(0);
    });

    it("Should fail to construct - invalid header 3", () => {
      let theError = "";

      try {
        const el = document.getElementById("invalid-header3");
        expect(el).not.toBeNull();

        const _rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error as string;
      }

      expect(theError.length > 0).toBe(true);
      expect(theError.indexOf("Markup validation: thead first row cells count")).toBe(0);
    });

    it("Should fail to construct - invalid header 4", () => {
      let theError = "";

      try {
        const el = document.getElementById("invalid-header4");
        expect(el).not.toBeNull();

        const _rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      } catch (error) {
        theError = error as string;
      }

      expect(theError.length > 0).toBe(true);
      expect(theError.indexOf("Markup validation: thead row count")).toBe(0);
    });

    it("Each new object should have a new id", () => {
      const el = document.getElementById("valid-table");
      expect(el).not.toBeNull();

      const elData = el as unknown as Record<string, unknown>;
      if (typeof elData[ResizableConstants.dataPropertyName] !== "undefined") {
        (elData[ResizableConstants.dataPropertyName] as ResizableTableColumns).dispose();
      }

      let rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      const id1 = rtc.id;
      rtc.dispose();

      rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      const id2 = rtc.id;
      rtc.dispose();

      rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      const id3 = rtc.id;
      rtc.dispose();

      expect(id2).toBe(id1 + 1);
      expect(id3).toBe(id2 + 1);
    });
  });
});
