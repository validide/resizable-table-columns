/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai/index.d.ts" />
/// <reference path="../node_modules/@types/jsdom/index.d.ts" />

import { assert } from 'chai';
import { JSDOM } from '../node_modules/jsdom/lib/api';
import UtilitiesDOM from '../dist/js/es6/utilities-dom';

describe('UtilitiesDOM', function() {
  const DOM = new JSDOM(`<!DOCTYPE html><html><head></head><body data-test-value-one="one" data-test-value-two="two" test-value-missing="one"></body></html>`);
  const testClass = 'test-class';
  const otherTestClass = 'other-test-class';
  describe('.hasClass', function() {
    it('Should be true', function() {
      const el = DOM.window.document.createElement('span');
      el.className = testClass;
      assert.equal(UtilitiesDOM.hasClass(el, testClass), true);
    });

    it('Should be false', function() {
      const el = DOM.window.document.createElement('span');
      el.className = testClass;
      assert.equal(UtilitiesDOM.hasClass(el, otherTestClass), false);
    });
  });

  describe('.addClass', function() {
    it('Add class', function() {
      const el = DOM.window.document.createElement('span');
      UtilitiesDOM.addClass(el, testClass);
      assert.equal(el.className, testClass);
      assert.equal(UtilitiesDOM.hasClass(el, testClass), true);
    });

    it('Do not add class twice', function() {
      const el = DOM.window.document.createElement('span');
      el.className = testClass;
      UtilitiesDOM.addClass(el, testClass);
      assert.equal(el.className, testClass);
      assert.equal(UtilitiesDOM.hasClass(el, testClass), true);
    });

    it('Do not alter exiting class', function() {
      const el = DOM.window.document.createElement('span');
      el.className = otherTestClass;
      UtilitiesDOM.addClass(el, testClass);
      assert.equal(el.className, `${otherTestClass} ${testClass}`);
      assert.equal(UtilitiesDOM.hasClass(el, testClass), true);
      assert.equal(UtilitiesDOM.hasClass(el, otherTestClass), true);
    });
  });

  describe('.removeClass', function() {
    it('Do not fail if missing', function() {
      const el = DOM.window.document.createElement('span');
      UtilitiesDOM.removeClass(el, testClass);
      assert.equal(el.className, '');
      assert.equal(UtilitiesDOM.hasClass(el, testClass), false);
    });

    it('Remove class', function() {
      const el = DOM.window.document.createElement('span');
      el.className = testClass;
      UtilitiesDOM.removeClass(el, testClass);
      assert.equal(el.className, '');
      assert.equal(UtilitiesDOM.hasClass(el, testClass), false);
    });

    it('Remove class if multiple', function() {
      const el = DOM.window.document.createElement('span');
      el.className = `${testClass} ${testClass} ${testClass}`;
      UtilitiesDOM.removeClass(el, testClass);
      assert.equal(el.className, '');
      assert.equal(UtilitiesDOM.hasClass(el, testClass), false);
    });

    it('Do not alter exiting class', function() {
      const el = DOM.window.document.createElement('span');
      el.className = otherTestClass;
      UtilitiesDOM.removeClass(el, testClass);
      assert.equal(el.className, otherTestClass);
      assert.equal(UtilitiesDOM.hasClass(el, testClass), false);
      assert.equal(UtilitiesDOM.hasClass(el, otherTestClass), true);
    });
  });

  describe('.getDataAttributesValues', function() {
    it('Should be "null" if not element is provided', function() {
      const dataValues = UtilitiesDOM.getDataAttributesValues();
      assert.equal(dataValues, null);
    });

    it('Should be true', function() {
      const dataValues = UtilitiesDOM.getDataAttributesValues(DOM.window.document.body);

      assert.equal(dataValues.hasOwnProperty('testValueOne'), true);
      assert.equal(dataValues.hasOwnProperty('testValueTwo'), true);
      assert.equal(dataValues.hasOwnProperty('testValueMissing'), false);
      assert.equal(dataValues['testValueOne'], 'one');
      assert.equal(dataValues['testValueTwo'], 'two');
    });
  });

});
