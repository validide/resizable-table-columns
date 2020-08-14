/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai/index.d.ts" />
/// <reference path="../node_modules/@types/jsdom/index.d.ts" />

import { assert } from 'chai';
import { JSDOM } from 'jsdom';
import { ResizableOptions } from '../sources/ts/resizable-options';

describe('ResizableOptions', function () {
  const DOM = new JSDOM(`<!DOCTYPE html>
  <html>
    <head></head>
    <body>
      <table id="the-table"
        data-obey-css-max-width="true"
        data-max-width="213"
        data-resize-from-body="true"
        ><tbody><tr><td><td></tr></tbody></table>
    </body>
  </html>`);

  describe('.constructor', function () {
    it('No params', function () {
      const opts = new ResizableOptions();
      assert.isObject(opts);
      assert.isNotNull(opts);
    });

    it('With "options" argument', function () {
      const store = {};
      const defaultOpts = new ResizableOptions();
      defaultOpts.obeyCssMinWidth = !defaultOpts.obeyCssMinWidth;
      defaultOpts.store = store;
      defaultOpts.maxWidth = Math.random();

      const opts = new ResizableOptions(defaultOpts);

      assert.isObject(opts);
      assert.isNotNull(opts);
      assert.deepEqual(defaultOpts.store, opts.store);
      assert.deepEqual(defaultOpts.obeyCssMinWidth, opts.obeyCssMinWidth);
      assert.deepEqual(defaultOpts.maxWidth, opts.maxWidth);
    });

    it('With "element" argument', function () {
      const el = DOM.window.document.getElementById('the-table');
      assert.isNotNull(el, 'Table element should be found in dom');

      const opts = new ResizableOptions(null, el);

      assert.isObject(opts);
      assert.isNotNull(opts);
      assert.isTrue(opts.obeyCssMaxWidth);
      assert.isTrue(opts.resizeFromBody);
      assert.isNumber(opts.maxWidth);
      assert.equal(opts.maxWidth, 213);

    });

    it('With "options" and "element" arguments', function () {
      const store = {};
      const defaultOpts = new ResizableOptions();
      defaultOpts.obeyCssMinWidth = !defaultOpts.obeyCssMinWidth;
      defaultOpts.store = store;
      defaultOpts.maxWidth = 2000;

      const el = DOM.window.document.getElementById('the-table');
      assert.isNotNull(el, 'Table element should be found in dom');

      const opts = new ResizableOptions(defaultOpts, el);

      assert.isObject(opts);
      assert.isNotNull(opts);
      assert.deepEqual(opts.store, opts.store);
      assert.deepEqual(opts.obeyCssMinWidth, opts.obeyCssMinWidth);
      assert.isTrue(opts.obeyCssMaxWidth);
      assert.isTrue(opts.resizeFromBody);
      assert.isNumber(opts.maxWidth);
      assert.equal(opts.maxWidth, 213);
    });
  });

  describe('.overrideValues', function () {
    it('Should not fail when called with no params', function () {
      const opts = new ResizableOptions();
      opts.overrideValues();
      assert.equal(opts.obeyCssMinWidth, opts.obeyCssMinWidth);
    });

    it('Should not fail when called with null param', function () {
      const opts = new ResizableOptions();
      opts.overrideValues(null);
      assert.equal(opts.obeyCssMinWidth, opts.obeyCssMinWidth);
    });

    it('Should override values', function () {
      const opts = new ResizableOptions();
      const obj = { obeyCssMinWidth: !opts.obeyCssMinWidth };
      opts.overrideValues(obj);
      assert.equal(obj.obeyCssMinWidth, opts.obeyCssMinWidth);
    });
  });

  describe('.overrideValuesFromElement', function () {
    it('Should not fail when called with no params', function () {
      const opts = new ResizableOptions();
      opts.overrideValuesFromElement();
      assert.equal(opts.obeyCssMinWidth, opts.obeyCssMinWidth);
    });

    it('Should not fail when called with null param', function () {
      const opts = new ResizableOptions();
      opts.overrideValuesFromElement(null);
      assert.equal(opts.obeyCssMinWidth, opts.obeyCssMinWidth);
    });

    it('Should override values', function () {
      const opts = new ResizableOptions();
      const el = DOM.window.document.getElementById('the-table');
      assert.isNotNull(el, 'Table element should be found in dom');

      opts.overrideValuesFromElement(el);
      assert.isTrue(opts.obeyCssMaxWidth);
      assert.isTrue(opts.resizeFromBody);
      assert.isNumber(opts.maxWidth);
      assert.equal(opts.maxWidth, 213);
    });
  });

});
