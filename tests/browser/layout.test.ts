import "../../sources/scss/resizable-table-columns.scss";
import { afterEach, describe, expect, it } from "vitest";
import { commands, page } from "vitest/browser";
import { ResizableConstants } from "../../sources/ts/resizable-constants";
import type { ResizableEventDetail } from "../../sources/ts/resizable-event-data";
import type { IStore, ResizableOptions } from "../../sources/ts/resizable-options";
import { ResizableTableColumns } from "../../sources/ts/resizable-table-columns";

// Fixed typography and box model so measurements are stable across machines.
const fixtureStyles = `
  body { margin: 0; font: 14px/1.2 Arial, Helvetica, sans-serif; }
  .host { width: 100%; }
  .host th, .host td { padding: 0 4px; border: 0; }
`;

const instances: ResizableTableColumns[] = [];

const mount = (
  tableHtml: string,
  options: Partial<ResizableOptions> | null = null,
  hostWidth = "800px",
): { table: HTMLTableElement; rtc: ResizableTableColumns } => {
  const style = document.createElement("style");
  style.textContent = fixtureStyles;
  const host = document.createElement("div");
  host.className = "host";
  host.style.width = hostWidth;
  host.innerHTML = tableHtml;
  document.body.append(style, host);

  const table = host.querySelector("table") as HTMLTableElement;
  const rtc = new ResizableTableColumns(table, options);
  instances.push(rtc);
  return { table, rtc };
};

const simpleTable = `<table data-rtc-resizable-table="browser.simple">
  <thead>
    <tr>
      <th>No.</th>
      <th data-rtc-resizable="name">Name</th>
      <th data-rtc-resizable="country">Country</th>
      <th data-rtc-resizable="city">City</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Alexander</td><td>Fiji</td><td>Istanbul</td></tr>
    <tr><td>2</td><td>Eugenia</td><td>Serbia</td><td>Minneapolis</td></tr>
  </tbody>
</table>`;

const center = (el: Element) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

const wrapperOf = (table: HTMLTableElement) => table.parentElement as HTMLDivElement;

afterEach(() => {
  for (const rtc of instances.splice(0)) rtc.dispose();
  document.body.innerHTML = "";
});

describe("initial layout", () => {
  it("stretches the table to fill the wrapper", () => {
    const { table, rtc } = mount(simpleTable);
    const wrapper = wrapperOf(table);

    expect(wrapper.classList.contains(ResizableConstants.classes.wrapper)).toBe(true);
    expect(table.offsetWidth).toBeGreaterThan(0);
    expect(Math.abs(table.offsetWidth - wrapper.clientWidth)).toBeLessThanOrEqual(1);

    // all the extra space goes to the resizable columns
    const total = rtc.tableHeaders.reduce((sum, th) => sum + th.offsetWidth, 0);
    expect(Math.abs(total - table.offsetWidth)).toBeLessThanOrEqual(2);
  });

  it("caps initial column widths with maxInitialWidthHint", () => {
    const longText = "A very long piece of cell content that would normally make the column wide";
    const { rtc } = mount(
      `<table>
        <thead><tr><th data-rtc-resizable="a">A</th><th data-rtc-resizable="b">B</th></tr></thead>
        <tbody><tr><td>${longText}</td><td>${longText}</td></tr></tbody>
      </table>`,
      { maxInitialWidthHint: 100 },
      "150px", // narrower than the table, so no stretching happens afterwards
    );

    for (const th of rtc.tableHeaders) {
      expect(Number.parseFloat(th.style.width)).toBeLessThanOrEqual(100);
    }
  });

  it("places each drag handle on its column's right edge", () => {
    const { rtc } = mount(simpleTable);
    const handles = rtc.getDragHandlers();
    const headers = rtc.getResizableHeaders();

    expect(handles).toHaveLength(headers.length);
    handles.forEach((handle, idx) => {
      const thRight = (headers[idx] as HTMLElement).getBoundingClientRect().right;
      expect(Math.abs(center(handle).x - thRight)).toBeLessThanOrEqual(4);
    });
  });

  it("makes handles span the whole table, or only the header when resizeFromBody is false", () => {
    const full = mount(simpleTable);
    for (const handle of full.rtc.getDragHandlers()) {
      expect(Math.abs(handle.offsetHeight - full.table.clientHeight)).toBeLessThanOrEqual(1);
    }

    const headOnly = mount(simpleTable.replace("browser.simple", "browser.head"), { resizeFromBody: false });
    const theadHeight = (headOnly.table.tHead as HTMLElement).clientHeight;
    expect(theadHeight).toBeLessThan(headOnly.table.clientHeight);
    for (const handle of headOnly.rtc.getDragHandlers()) {
      expect(Math.abs(handle.offsetHeight - theadHeight)).toBeLessThanOrEqual(1);
    }
  });
});

describe("dragging with a real mouse", () => {
  it("resizes the column and table, fires events and persists widths", async () => {
    const saved: Record<string, unknown> = {};
    const store: IStore = {
      get: (id) => saved[id],
      set: (id, data) => {
        saved[id] = data;
      },
    };
    const { table, rtc } = mount(simpleTable, { store });

    const column = rtc.getResizableHeaders()[0] as HTMLTableCellElement;
    const handle = rtc.getDragHandlers()[0] as HTMLDivElement;
    const before = { column: column.offsetWidth, table: table.offsetWidth };

    const events: Array<{ type: string; detail: ResizableEventDetail }> = [];
    for (const name of [
      ResizableConstants.events.eventResizeStart,
      ResizableConstants.events.eventResize,
      ResizableConstants.events.eventResizeStop,
    ]) {
      table.addEventListener(name, (e) => events.push({ type: e.type, detail: (e as CustomEvent).detail }));
    }

    const from = center(handle);
    await commands.pointerDrag(from, { x: from.x + 60, y: from.y });

    // no jump by the cell padding: the column grows exactly by the pointer delta
    expect(Math.abs(column.offsetWidth - before.column - 60)).toBeLessThanOrEqual(1);
    expect(Math.abs(table.offsetWidth - before.table - 60)).toBeLessThanOrEqual(1);

    expect(events[0]?.type).toBe(ResizableConstants.events.eventResizeStart);
    expect(events.at(-1)?.type).toBe(ResizableConstants.events.eventResizeStop);
    expect(events.some((e) => e.type === ResizableConstants.events.eventResize)).toBe(true);
    expect(events.at(-1)?.detail.column).toBe(column);

    // classes are cleaned up after the drag
    expect(table.classList.contains(ResizableConstants.classes.tableResizing)).toBe(false);
    expect(column.classList.contains(ResizableConstants.classes.columnResizing)).toBe(false);

    // the handle follows the column edge
    expect(Math.abs(center(handle).x - column.getBoundingClientRect().right)).toBeLessThanOrEqual(4);

    const stored = saved["rtc/browser_simple"] as { table: number; columns: Record<string, number> };
    expect(stored.columns.name).toBe(column.offsetWidth);
    expect(stored.table).toBe(table.offsetWidth);
  });

  it("clamps the column to minWidth and maxWidth", async () => {
    const { table, rtc } = mount(simpleTable, { minWidth: 50, maxWidth: 220 });
    const column = rtc.getResizableHeaders()[0] as HTMLTableCellElement;
    const handle = rtc.getDragHandlers()[0] as HTMLDivElement;
    const widths: number[] = [];
    table.addEventListener(ResizableConstants.events.eventResize, (e) =>
      widths.push((e as CustomEvent<ResizableEventDetail>).detail.columnWidth),
    );

    // Shrinking: clamped to minWidth while dragging. On release the table is re-stretched to fill
    // its wrapper, which may hand some width back to the column, but never below minWidth.
    // (Keep the pointer inside the viewport: off-screen moves are not delivered.)
    let from = center(handle);
    await commands.pointerDrag(from, { x: Math.max(5, from.x - 400), y: from.y });
    expect(widths.at(-1)).toBe(50);
    expect(column.offsetWidth).toBeGreaterThanOrEqual(50);
    // the re-stretch must account for every pixel (no width left for the browser to spread around)
    const total = rtc.tableHeaders.reduce((sum, th) => sum + th.offsetWidth, 0);
    expect(Math.abs(total - table.offsetWidth)).toBeLessThanOrEqual(2);
    expect(Math.abs(table.offsetWidth - (table.parentElement as HTMLElement).clientWidth)).toBeLessThanOrEqual(1);

    // Growing: clamped to maxWidth, and the table is wide enough that nothing is redistributed.
    // Wait past the double-click window (doubleClickDelay, 500 ms) so this is a new, separate drag.
    await new Promise((resolve) => setTimeout(resolve, 600));
    from = center(handle);
    await commands.pointerDrag(from, { x: from.x + 400, y: from.y });
    expect(widths.at(-1)).toBe(220);
    expect(column.offsetWidth).toBe(220);
  });

  it("auto-fits the column to its widest content on double-click", async () => {
    const longText = "Considerably longer content than fits";
    const { rtc } = mount(
      `<table>
        <thead><tr><th data-rtc-resizable="a">A</th><th data-rtc-resizable="b">B</th></tr></thead>
        <tbody><tr><td>${longText}</td><td>x</td></tr></tbody>
      </table>`,
      { maxInitialWidthHint: 60 },
      "120px",
    );
    const column = rtc.getResizableHeaders()[0] as HTMLTableCellElement;
    const handle = rtc.getDragHandlers()[0] as HTMLDivElement;

    const probe = document.createElement("span");
    probe.style.cssText =
      "position:absolute;visibility:hidden;white-space:nowrap;font:14px/1.2 Arial, Helvetica, sans-serif";
    probe.textContent = longText;
    document.body.append(probe);
    const textWidth = probe.offsetWidth;

    expect(column.offsetWidth).toBeLessThan(textWidth);

    await commands.pointerDoubleClick(center(handle));

    expect(column.offsetWidth).toBeGreaterThanOrEqual(textWidth);
    expect(column.offsetWidth).toBeLessThanOrEqual(textWidth + 30);
  });
});

describe("window resize", () => {
  it("re-stretches the table when the viewport grows", async () => {
    await page.viewport(700, 700);
    const { table } = mount(simpleTable, null, "100%");
    const wrapper = wrapperOf(table);
    expect(Math.abs(table.offsetWidth - wrapper.clientWidth)).toBeLessThanOrEqual(1);

    await page.viewport(1100, 700);

    await expect.poll(() => wrapper.clientWidth).toBeGreaterThan(1000);
    await expect.poll(() => Math.abs(table.offsetWidth - wrapper.clientWidth)).toBeLessThanOrEqual(1);

    await page.viewport(1000, 700);
  });
});
