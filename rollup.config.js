export default [
  {
    input: './dist/js/es6/resizable-table-columns.js',
    context: 'window',
    output: {
      format: 'umd',
      name: 'validide_resizableTableColumns',
      dir: './dist/js/bundle/',
      sourcemap: true
    }
  }
]
