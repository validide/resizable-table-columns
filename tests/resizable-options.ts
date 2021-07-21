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
        data-min-width="-10"
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
      defaultOpts.store = store as any;
      defaultOpts.maxWidth = Math.random();

      const opts = new ResizableOptions(defaultOpts);

      assert.isObject(opts);
      assert.isNotNull(opts);
      assert.deepEqual(defaultOpts.store, opts.store);
      assert.deepEqual(defaultOpts.maxWidth, opts.maxWidth);
    });

    it('With "element" argument', function () {
      const el = DOM.window.document.getElementById('the-table');
      assert.isNotNull(el, 'Table element should be found in dom');

      const opts = new ResizableOptions(null, el);

      assert.isObject(opts);
      assert.isNotNull(opts);
      assert.isTrue(opts.resizeFromBody);
      assert.isNumber(opts.maxWidth);
      assert.equal(opts.maxWidth, 213);

    });

    it('With "options" and "element" arguments', function () {
      const store = {};
      const defaultOpts = new ResizableOptions();
      defaultOpts.store = store as any;
      defaultOpts.maxWidth = 2000;

      const el = DOM.window.document.getElementById('the-table');
      assert.isNotNull(el, 'Table element should be found in dom');

      const opts = new ResizableOptions(defaultOpts, el);

      assert.isObject(opts);
      assert.isNotNull(opts);
      assert.deepEqual(opts.store, opts.store);
      assert.isTrue(opts.resizeFromBody);
      assert.isNumber(opts.maxWidth);
      assert.equal(opts.maxWidth, 213);
    });
  });

  describe('.overrideValues', function () {
    it('Should not fail when called with no params', function () {
      const opts = new ResizableOptions();
      opts.overrideValues();
      assert.equal(opts.minWidth, opts.minWidth);
    });

    it('Should not fail when called with null param', function () {
      const opts = new ResizableOptions();
      opts.overrideValues(null);
      assert.equal(opts.minWidth, opts.minWidth);
    });

    it('Should override values', function () {
      const opts = new ResizableOptions();
      const obj = { minWidth: -10 };
      opts.overrideValues(obj);
      assert.equal(obj.minWidth, opts.minWidth);
    });
  });

  describe('.overrideValuesFromElement', function () {
    it('Should not fail when called with no params', function () {
      const opts = new ResizableOptions();
      opts.overrideValuesFromElement();
      assert.equal(opts.minWidth, opts.minWidth);
    });

    it('Should not fail when called with null param', function () {
      const opts = new ResizableOptions();
      opts.overrideValuesFromElement(null);
      assert.equal(opts.minWidth, opts.minWidth);
    });

    it('Should override values', function () {
      const opts = new ResizableOptions();
      const el = DOM.window.document.getElementById('the-table');
      assert.isNotNull(el, 'Table element should be found in dom');

      opts.overrideValuesFromElement(el);
      assert.equal(opts.minWidth, -10);
      assert.isTrue(opts.resizeFromBody);
      assert.isNumber(opts.maxWidth);
      assert.equal(opts.maxWidth, 213);
    });
  });

});
