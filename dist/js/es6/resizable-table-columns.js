import ResizableOptions from './resizable-options';
var ResizableTableColumns = (function () {
    function ResizableTableColumns(table, options) {
        this.table = table;
        this.options = new ResizableOptions(options, table);
    }
    ResizableTableColumns.prototype.init = function () {
    };
    ResizableTableColumns.prototype.dispose = function () {
    };
    return ResizableTableColumns;
}());
export default ResizableTableColumns;
