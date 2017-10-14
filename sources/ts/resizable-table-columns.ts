import UtilitiesDOM from './utilities-dom'
import ResizableOptions from './resizable-options'

export default class ResizableTableColumns {
  table: HTMLTableElement;
  options: ResizableOptions;

  constructor(table: HTMLTableElement, options: ResizableOptions) {
    this.table = table;
    this.options = new ResizableOptions(options, table);
  }

  init() {
    //UtilitiesDOM.addClass(null, '');
  }

  dispose() {
  }
}
