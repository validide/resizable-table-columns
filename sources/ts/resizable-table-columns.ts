import ResizableOptions from './resizable-options'
import Utilities from './utilities'
import UtilitiesDOM from './utilities-dom'

export default class ResizableTableColumns {
  table: HTMLTableElement;
  options: ResizableOptions;

  constructor(table: HTMLTableElement, options: ResizableOptions) {
    this.table = table;
    this.options = new ResizableOptions(options, table);
  }

  init() {
  }

  dispose() {
  }
}
