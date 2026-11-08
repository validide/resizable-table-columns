import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ResizableConstants } from "../sources/ts/resizable-constants";
import type { ResizableEventDetail } from "../sources/ts/resizable-event-data";
import type { IStore } from "../sources/ts/resizable-options";
import { ResizableTableColumns } from "../sources/ts/resizable-table-columns";

const markup = `<table id="t" data-rtc-resizable-table="pointer.table">
  <thead>
    <tr>
      <th>No.</th>
      <th data-rtc-resizable="name">Name</th>
      <th data-rtc-resizable="country">Country</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Alexander</td><td>Fiji</td></tr>
  </tbody>
</table>`;

const pointer = (type: string, target: EventTarget, pageX: number, button = 0) => {
  const evt = new PointerEvent(type, { bubbles: true, cancelable: true, button, pointerId: 1 });
  // jsdom does not compute page coordinates from clientX; define pageX explicitly
  Object.defineProperty(evt, "pageX", { value: pageX });
  target.dispatchEvent(evt);
  return evt;
};

describe("ResizableTableColumns pointer interaction", () => {
  let table: HTMLTableElement;
  let rtc: ResizableTableColumns;
  let store: IStore & { data: Record<string, unknown> };

  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = markup;
    table = document.getElementById("t") as HTMLTableElement;
    store = {
      data: {},
      get(id) {
        return this.data[id];
      },
      set(id, value) {
        this.data[id] = value;
      },
    };
    rtc = new ResizableTableColumns(table, { store });
  });

  afterEach(() => {
    rtc.dispose();
    vi.useRealTimers();
  });

  it("listens for pointer events", () => {
    expect(ResizableConstants.events.pointerDown).toEqual(["pointerdown"]);
    expect(ResizableConstants.events.pointerMove).toEqual(["pointermove"]);
    expect(ResizableConstants.events.pointerUp).toEqual(["pointerup", "pointercancel"]);
  });

  it("resizes a column on drag and dispatches start/resize/stop events", () => {
    const events: Array<{ type: string; detail: ResizableEventDetail }> = [];
    for (const name of [
      ResizableConstants.events.eventResizeStart,
      ResizableConstants.events.eventResize,
      ResizableConstants.events.eventResizeStop,
    ]) {
      table.addEventListener(name, (e) => events.push({ type: e.type, detail: (e as CustomEvent).detail }));
    }

    const handle = rtc.getDragHandlers()[0] as HTMLDivElement;
    const column = rtc.getResizableHeaders()[0] as HTMLTableCellElement;

    const down = pointer("pointerdown", handle, 100);
    expect(down.defaultPrevented).toBe(true);
    expect(table.classList.contains(ResizableConstants.classes.tableResizing)).toBe(true);
    expect(column.classList.contains(ResizableConstants.classes.columnResizing)).toBe(true);

    pointer("pointermove", document, 175);
    vi.advanceTimersByTime(10);
    expect(column.style.width).toBe("75px");

    pointer("pointerup", document, 175);
    expect(table.classList.contains(ResizableConstants.classes.tableResizing)).toBe(false);
    expect(column.classList.contains(ResizableConstants.classes.columnResizing)).toBe(false);

    expect(events.map((e) => e.type)).toEqual([
      ResizableConstants.events.eventResizeStart,
      ResizableConstants.events.eventResize,
      ResizableConstants.events.eventResizeStop,
    ]);
    expect(events[1]?.detail.column).toBe(column);
    expect(events[1]?.detail.columnWidth).toBe(75);
    expect(events[1]?.detail.table).toBe(table);
    expect(store.data["rtc/pointer_table"]).toBeTypeOf("object");
  });

  it("respects minWidth while dragging", () => {
    const handle = rtc.getDragHandlers()[0] as HTMLDivElement;
    const column = rtc.getResizableHeaders()[0] as HTMLTableCellElement;

    pointer("pointerdown", handle, 100);
    pointer("pointermove", document, 110);
    vi.advanceTimersByTime(10);
    pointer("pointerup", document, 110);

    expect(column.style.width).toBe("40px");
  });

  it("ignores non-primary buttons", () => {
    const handle = rtc.getDragHandlers()[0] as HTMLDivElement;
    pointer("pointerdown", handle, 100, 2);
    expect(rtc.eventData).toBeNull();
    expect(table.classList.contains(ResizableConstants.classes.tableResizing)).toBe(false);
  });

  it("treats pointercancel like pointerup", () => {
    const handle = rtc.getDragHandlers()[0] as HTMLDivElement;
    pointer("pointerdown", handle, 100);
    expect(rtc.eventData).not.toBeNull();
    pointer("pointercancel", document, 100);
    expect(rtc.eventData).toBeNull();
  });
});

describe("ResizableTableColumns.getTextWidth", () => {
  it("never parses cell text as HTML", () => {
    const cell = document.createElement("td");
    cell.textContent = '<img src="x" onerror="window.__rtcXss = true">';
    const span = document.createElement("span");
    document.body.append(cell, span);

    ResizableTableColumns.getTextWidth(cell, span);

    expect(span.querySelector("img")).toBeNull();
    expect(span.textContent).toBe('<img src="x" onerror="window.__rtcXss = true"> ');
  });
});

describe("ResizableTableColumns.dispose", () => {
  it("restores the DOM and allows a new instance on the same table", () => {
    document.body.innerHTML = markup;
    const table = document.getElementById("t") as HTMLTableElement;

    const first = new ResizableTableColumns(table);
    expect(table.parentElement?.classList.contains(ResizableConstants.classes.wrapper)).toBe(true);

    first.dispose();
    expect(table.parentElement).toBe(document.body);
    expect(document.querySelector(`.${ResizableConstants.classes.handleContainer}`)).toBeNull();
    expect(first.dragHandlesContainer).toBeNull();
    expect(first.tableHeaders).toEqual([]);

    const second = new ResizableTableColumns(table);
    expect(second.getDragHandlers()).toHaveLength(2);
    second.dispose();
  });
});
