import { beforeAll, describe, expect, it } from "vitest";
import { ResizableConstants } from "../sources/ts/resizable-constants";
import { ResizableTableColumns } from "../sources/ts/resizable-table-columns";

describe("ResizableTableColumns", () => {
  describe(".dispose", () => {
    beforeAll(() => {
      document.body.innerHTML = `<table id="valid-table">
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
      </table>`;
    });

    it("Should dispose the object", () => {
      const el = document.getElementById("valid-table");
      expect(el).not.toBeNull();

      const rtc = new ResizableTableColumns(el as HTMLTableElement, null);
      rtc.dispose();

      expect(rtc).toBeTypeOf("object");
      expect(typeof (el as unknown as Record<string, unknown>)[ResizableConstants.dataPropertyName]).toBe("undefined");
    });
  });
});
