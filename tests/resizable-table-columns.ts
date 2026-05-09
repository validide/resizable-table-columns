import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ResizableOptions } from "../sources/ts/resizable-options";
import { ResizableTableColumns } from "../sources/ts/resizable-table-columns";

describe("ResizableTableColumns", () => {
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

  const dynamicTable = `<table style="width: 7000px">
  <thead>
    <tr>
      <th id="th1" style="width: 110px">No.</th>
      <th id="th2" style="width: 120px">Name</th>
      <th id="th3" style="width: 130px">Counrty</th>
      <th id="th4" style="width: 140px">Region</th>
      <th id="th5" style="width: 150px">City</th>
      <th id="th6" style="width: 160px">Street</th>
      <th id="th7" style="width: 170px">Post Code</th>
      <th id="th8" style="width: 180px">Last updated</th>
      <th id="th9" style="width: 190px">UUID</th>
    </tr>
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

  const el = document.getElementById("valid-table") as HTMLTableElement;
  const rtc = new ResizableTableColumns(el, null);

  describe("Constructor calls", () => {
    let container: HTMLElement, el: HTMLTableElement, rtc: ResizableTableColumns;
    beforeAll(() => {
      container = document.createElement("div");
      container.innerHTML = dynamicTable;

      document.body.appendChild(container);
      const overriders = new ResizableOptions();
      overriders.minWidth = 130;
      overriders.maxWidth = 170;
      el = container.querySelector("table") as HTMLTableElement;
      rtc = new ResizableTableColumns(el, overriders);
    });

    afterAll(() => {
      rtc.dispose();
      document.body.removeChild(container);
    });

    it('Should ".wrapTable()"', () => {
      const wrapper = el.parentNode as HTMLElement;
      expect(wrapper).not.toBeNull();
      expect(wrapper.nodeName).toBe("DIV");
      expect(wrapper.classList.contains("rtc-wrapper")).toBe(true);
      expect(el.classList.contains("rtc-table")).toBe(true);
    });

    it('Should ".asignTableHeaders()"', () => {
      expect(rtc.tableHeaders).not.toBeNull();
      expect(rtc.tableHeaders.length).toBe(9);
      for (let index = 0; index < rtc.tableHeaders.length; index++) {
        const th = rtc.tableHeaders[index];
        expect(th.id).toBe(`th${index + 1}`);
      }
    });

    it('Should ".storeOriginalWidths()"', () => {
      expect(rtc.originalWidths).not.toBeNull();
      expect(rtc.originalWidths[rtc.originalWidths.length - 1].detail).toBe("7000px");

      for (let index = 0; index < rtc.tableHeaders.length - 1; index++) {
        expect(rtc.originalWidths[index].detail).toBe(`${100 + (index + 1) * 10}px`);
      }
    });

    it('Should ".setHeaderWidths()"', () => {
      for (let index = 0; index < rtc.tableHeaders.length; index++) {
        const th = rtc.tableHeaders[index];
        rtc.constrainWidth(th, th.offsetWidth);
        expect(th.style.width.endsWith("px")).toBe(true);
        expect(parseFloat(th.style.width)).toBeGreaterThan(0);
      }
    });

    it('Should ".createDragHandles()"', () => {
      const dragWrapper = el.parentNode?.childNodes[0] as HTMLElement;
      expect(dragWrapper).not.toBeNull();
      expect(dragWrapper.nodeName).toBe("DIV");
      expect(dragWrapper.classList.contains("rtc-handle-container")).toBe(true);

      const resizableHeaders = rtc.getResizableHeaders();
      expect(dragWrapper.childNodes.length).toBe(resizableHeaders.length);

      for (let index = 0; index < dragWrapper.childNodes.length; index++) {
        expect((dragWrapper.childNodes[index] as HTMLElement).classList.contains("rtc-handle")).toBe(true);
      }
    });
  });

  describe("Dispose calls", () => {
    let container: HTMLElement, el: HTMLTableElement, rtc: ResizableTableColumns;
    beforeAll(() => {
      container = document.createElement("div");
      container.innerHTML = dynamicTable;

      document.body.appendChild(container);
      el = container.querySelector("table") as HTMLTableElement;
      rtc = new ResizableTableColumns(el, null);
      rtc.dispose();
    });

    afterAll(() => {
      document.body.removeChild(container);
    });

    it('Should ".unwrapTable()"', () => {
      expect(el.parentNode).toBe(container);
      expect(el.classList.contains("rtc-table")).toBe(false);
    });

    it('Should ".restoreOriginalWidths()"', () => {
      for (let index = 1; index <= 9; index++) {
        const th = document.getElementById(`th${index}`) as HTMLElement;
        expect(th.style.width).toBe(`${100 + index * 10}px`);
      }
      expect(el.style.width).toBe("7000px");
    });

    it('Should ".destroyDragHandles()"', () => {
      expect(container.querySelectorAll(".rtc-handle-container").length).toBe(0);
      expect(container.querySelectorAll(".rtc-handle").length).toBe(0);
    });
  });

  describe("Instance methods", () => {
    it(".getResizableHeaders()", () => {
      const unresizable = rtc.getResizableHeaders().filter((el, _idx) => {
        return !el.hasAttribute("data-rtc-resizable");
      });
      expect(unresizable.length).toBe(0);
    });

    it(".getDragHandlers()", () => {
      const dragHandlers = rtc.getDragHandlers();
      for (let index = 0; index < dragHandlers.length; index++) {
        expect(dragHandlers[index].nodeName).toBe("DIV");
        expect(dragHandlers[index].classList.contains("rtc-handle")).toBe(true);
      }
    });
  });

  describe(".createHandlerReferences()", () => {
    it('Create "onPointerDownRef"', () => {
      expect(typeof rtc.onPointerDownRef).toBe("function");
    });

    it('Create "onPointerMoveRef"', () => {
      expect(typeof rtc.onPointerMoveRef).toBe("function");
    });

    it('Create "onPointerUpRef"', () => {
      expect(typeof rtc.onPointerUpRef).toBe("function");
    });
  });

  describe(".registerWindowResizeHandler()", () => {
    it('Should be true "registerWindowResizeHandler"', () => {
      expect(ResizableTableColumns.windowResizeHandlerRef != null).toBe(true);
    });
  });

  describe("static.generateTableId()", () => {
    it('Should be "" (empty string) if attriute is missing', () => {
      const el = document.createElement("table");
      const id = ResizableTableColumns.generateTableId(el);
      expect(id).toBe("");
    });

    it('Should be "rtc/table_one" if attriute value is " table_one "', () => {
      const el = document.createElement("table");
      el.setAttribute("data-rtc-resizable-table", " table_one ");
      const id = ResizableTableColumns.generateTableId(el);
      expect(id).toBe("rtc/table_one");
    });

    it('Should be "rtc/table_two_two" if attriute value is "table.two.two"', () => {
      const el = document.createElement("table");
      el.setAttribute("data-rtc-resizable-table", "table.two.two");
      const id = ResizableTableColumns.generateTableId(el);
      expect(id).toBe("rtc/table_two_two");
    });
  });

  describe("static.generateColumnId()", () => {
    it('Should be "" (empty string) if attriute is missing', () => {
      const el = document.createElement("div");
      const id = ResizableTableColumns.generateColumnId(el);
      expect(id).toBe("");
    });

    it('Should be "column_one" if attriute value is " column_one "', () => {
      const el = document.createElement("div");
      el.setAttribute("data-rtc-resizable", " column_one ");
      const id = ResizableTableColumns.generateColumnId(el);
      expect(id).toBe("column_one");
    });

    it('Should be "cell_two_two" if attriute value is "cell.two.two"', () => {
      const el = document.createElement("div");
      el.setAttribute("data-rtc-resizable", "cell.two.two");
      const id = ResizableTableColumns.generateColumnId(el);
      expect(id).toBe("cell_two_two");
    });
  });

  describe("static.setWidth()", () => {
    it("Should be 0 for -1", () => {
      const el = document.createElement("span");
      ResizableTableColumns.setWidth(el, -1);
      expect(el.style.width).toBe("0px");
    });

    it("Should be 0 for 0", () => {
      const el = document.createElement("span");
      ResizableTableColumns.setWidth(el, 0);
      expect(el.style.width).toBe("0px");
    });

    it("Should set width and round to 2 decimals", () => {
      const el = document.createElement("span");
      ResizableTableColumns.setWidth(el, 2);
      expect(el.style.width.endsWith("px")).toBe(true);
      expect(parseFloat(el.style.width)).toBe(2);
    });

    it("Should set width and round to 2 decimals for 3.1", () => {
      const el = document.createElement("span");
      ResizableTableColumns.setWidth(el, 3.1);
      expect(parseFloat(el.style.width)).toBe(3.1);
    });

    it("Should set width and round to 2 decimals for 4.25", () => {
      const el = document.createElement("span");
      ResizableTableColumns.setWidth(el, 4.25);
      expect(parseFloat(el.style.width)).toBe(4.25);
    });

    it("Should set width and round to 2 decimals for 5.449", () => {
      const el = document.createElement("span");
      ResizableTableColumns.setWidth(el, 5.449);
      expect(parseFloat(el.style.width)).toBe(5.45);
    });

    it("Should set width and round to 2 decimals for 5.450", () => {
      const el = document.createElement("span");
      ResizableTableColumns.setWidth(el, 5.45);
      expect(parseFloat(el.style.width)).toBe(5.45);
    });

    it("Should set width and round to 2 decimals for 5.451", () => {
      const el = document.createElement("span");
      ResizableTableColumns.setWidth(el, 5.451);
      expect(parseFloat(el.style.width)).toBe(5.45);
    });
  });

  describe("static.getInstanceId()", () => {
    it("Incement after each call", () => {
      const id1 = ResizableTableColumns.getInstanceId();
      const id2 = ResizableTableColumns.getInstanceId();

      expect(id2).toBe(id1 + 1);
    });
  });
});
