import { describe, expect, it } from "vitest";
import * as api from "../sources/ts/index";

// Guards the public API surface: removing or renaming any of these is a breaking change.
describe("public API surface", () => {
  it("exports the expected runtime values", () => {
    expect(Object.keys(api).sort()).toEqual(
      [
        "PointerData",
        "ResizableConstants",
        "ResizableEventData",
        "ResizableOptions",
        "ResizableTableColumns",
        "Utilities",
        "UtilitiesDOM",
        "WidthsData",
      ].sort(),
    );
  });

  it("keeps ResizableTableColumns instance methods", () => {
    const proto = Object.getOwnPropertyNames(api.ResizableTableColumns.prototype);
    for (const name of [
      "init",
      "dispose",
      "validateMarkup",
      "wrapTable",
      "unwrapTable",
      "assignTableHeaders",
      "storeOriginalWidths",
      "restoreOriginalWidths",
      "setHeaderWidths",
      "constrainWidth",
      "createDragHandles",
      "destroyDragHandles",
      "getDragHandlers",
      "restoreColumnWidths",
      "checkTableWidth",
      "syncHandleWidths",
      "getResizableHeaders",
      "handlePointerDown",
      "handlePointerMove",
      "handlePointerUp",
      "handleDoubleClick",
      "attachHandlers",
      "detachHandlers",
      "refreshWrapperStyle",
      "saveColumnWidths",
      "createHandlerReferences",
      "registerWindowResizeHandler",
      "handleWindowResize",
      "updateWidth",
    ]) {
      expect(proto, name).toContain(name);
    }
  });

  it("keeps ResizableTableColumns static members", () => {
    const statics = Object.getOwnPropertyNames(api.ResizableTableColumns);
    for (const name of [
      "instancesCount",
      "windowResizeHandlerRef",
      "onWindowResize",
      "generateColumnId",
      "generateTableId",
      "setWidth",
      "getInstanceId",
      "debounce",
      "getPointerX",
      "getTextWidth",
      "getOffset",
    ]) {
      expect(statics, name).toContain(name);
    }
  });

  it("keeps ResizableOptions defaults and methods", () => {
    const options = new api.ResizableOptions();
    expect({ ...options }).toEqual({
      resizeFromBody: true,
      minWidth: 40,
      maxWidth: null,
      doubleClickDelay: 500,
      maxInitialWidthHint: null,
      store: null,
    });
    expect(typeof options.overrideValues).toBe("function");
    expect(typeof options.overrideValuesFromElement).toBe("function");
  });

  it("keeps constant names", () => {
    expect(api.ResizableConstants.dataPropertyName).toBe("validide_rtc_data_object");
    expect(api.ResizableConstants.classes).toEqual({
      table: "rtc-table",
      wrapper: "rtc-wrapper",
      handleContainer: "rtc-handle-container",
      handle: "rtc-handle",
      tableResizing: "rtc-table-resizing",
      columnResizing: "rtc-column-resizing",
    });
    expect(api.ResizableConstants.attributes).toEqual({
      dataResizable: "data-rtc-resizable",
      dataResizableTable: "data-rtc-resizable-table",
    });
    expect(Object.keys(api.ResizableConstants.events).sort()).toEqual(
      [
        "pointerDown",
        "pointerMove",
        "pointerUp",
        "windowResize",
        "eventResizeStart",
        "eventResize",
        "eventResizeStop",
      ].sort(),
    );
    expect(api.ResizableConstants.events.eventResizeStart).toBe("eventResizeStart.rtc");
    expect(api.ResizableConstants.events.eventResize).toBe("eventResize.rtc");
    expect(api.ResizableConstants.events.eventResizeStop).toBe("eventResizeStop.rtc");
  });
});
