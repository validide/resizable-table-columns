export class WidthsData {
  column: number = 0;
  table: number = 0;
}

export class PointerData {
  x: number | null = null;
  isDoubleClick: boolean = false;
}

export class ResizableEventData {
  column: HTMLTableCellElement;
  dragHandler: HTMLDivElement;
  pointer: PointerData = new PointerData();
  originalWidths: WidthsData = new WidthsData();
  newWidths: WidthsData = new WidthsData();
  columnRatio: number = 0;
  tableRatio: number = 0;

  constructor(column: HTMLTableCellElement, dragHandler: HTMLDivElement) {
      this.column = column;
      this.dragHandler = dragHandler;
  }
}
