export default class ResizableEventData {
  column: HTMLTableCellElement;
  dragHandler: HTMLDivElement;
  pointer: {
    x: number,
    isDoubleClick: boolean
  }
  originalWidths: {
    column: number;
    table: number;
  };
  newWidths: {
    column: number;
    table: number;
  };
}
