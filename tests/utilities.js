/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai/index.d.ts" />

import { assert } from 'chai';
import Utilities from '../dist/js/es6/utilities';

describe('Utilities', function () {
  describe('.escapeRegExp', function () {
    it('Should not change "randomText"', function () {
      assert.equal(Utilities.escapeRegExp('randomText'), 'randomText');
    });

    it('Should change "random-text\\" to "random\\-text\\\\"', function () {
      assert.equal(Utilities.escapeRegExp('random-text\\'), 'random\\-text\\\\');
    });

    it('Should change "random.text" to "random\\.text"', function () {
      assert.equal(Utilities.escapeRegExp('random.text'), 'random\\.text');
    });
  });

  describe('.kebabCaseToCamelCase', function () {
    it('Should change "kebab-case" to "kebabCase"', function () {
      assert.equal(Utilities.kebabCaseToCamelCase('kebab-case'), 'kebabCase');
    });
  });

  describe('.parseStringToType', function () {
    it('Should be string for empty', function () {
      const tesString = '';
      const result = Utilities.parseStringToType(tesString);
      assert.isString(result);
      assert.equal(result, result);
    });

    it('Should be string for whitespace', function () {
      const tesString = ' \n\r\t';
      const result = Utilities.parseStringToType(tesString);
      assert.isString(result);
      assert.equal(result, tesString);
    });

    it('Should be string', function () {
      const tesString = 'some test 12 .34 \r \t \n some more';
      const result = Utilities.parseStringToType(tesString);
      assert.isString(result);
      assert.equal(result, tesString);
    });

    it('Should be string for "10px"', function () {
      const tesString = '10px';
      const result = Utilities.parseStringToType(tesString);
      assert.isString(result);
      assert.equal(result, tesString);
    });

    it('Should be string for "1.2.3"', function () {
      const tesString = '1.2.3';
      const result = Utilities.parseStringToType(tesString);
      assert.isString(result);
      assert.equal(result, tesString);
    });

    it('Should be string for "10e"', function () {
      const tesString = '10e';
      const result = Utilities.parseStringToType(tesString);
      assert.isString(result);
      assert.equal(result, tesString);
    });

    it('Should be boolen "true"', function () {
      const result = Utilities.parseStringToType('tRue');
      assert.isBoolean(result);
      assert.isTrue(result);
    });

    it('Should be boolen "false"', function () {
      const result = Utilities.parseStringToType('FaLsE');
      assert.isBoolean(result);
      assert.isFalse(result);
    });

    it('Should be number "-1"', function () {
      const result = Utilities.parseStringToType('-1');
      assert.isNumber(result);
      assert.equal(result, -1);
    });

    it('Should be number "1"', function () {
      const result = Utilities.parseStringToType('1');
      assert.isNumber(result);
      assert.equal(result, 1);
    });

    it('Should be number ".1"', function () {
      const result = Utilities.parseStringToType('.1');
      assert.isNumber(result);
      assert.equal(result, 0.1);
    });

    it('Should be number "-.1"', function () {
      const result = Utilities.parseStringToType('-.1');
      assert.isNumber(result);
      assert.equal(result, -0.1);
    });

    it('Should be number "0.1"', function () {
      const result = Utilities.parseStringToType('0.1');
      assert.isNumber(result);
      assert.equal(result, 0.1);
    });

    it('Should be number "-0.1"', function () {
      const result = Utilities.parseStringToType('-0.1');
      assert.isNumber(result);
      assert.equal(result, -0.1);
    });

    it('Should be number "1e+30"', function () {
      const result = Utilities.parseStringToType('1e+30');
      assert.isNumber(result);
      assert.equal(result, 1e+30);
    });

    it('Should be number "Infinity"', function () {
      const result = Utilities.parseStringToType('Infinity');
      assert.isNumber(result);
      assert.equal(result, Infinity);
    });

    it('Should be number "-Infinity"', function () {
      const result = Utilities.parseStringToType('-Infinity');
      assert.isNumber(result);
      assert.equal(result, -Infinity);
    });
  });

  describe('.parseStyleDimension', function () {
    it('Should parse "12"(string) to 12(number)', function () {
      assert.equal(Utilities.parseStyleDimension('12', false), 12);
    });

    it('Should parse "12px"(string) to 12(number)', function () {
      assert.equal(Utilities.parseStyleDimension('12px', false), 12);
    });

    it('Should parse 12(number) to 12(number)', function () {
      assert.equal(Utilities.parseStyleDimension(12, false), 12);
    });

    it('Should parse "13.12"(string) to 13.12(number)', function () {
      assert.equal(Utilities.parseStyleDimension('13.12', false), 13.12);
    });

    it('Should parse "13.12px"(string) to 13.12(number)', function () {
      assert.equal(Utilities.parseStyleDimension('13.12px', false), 13.12);
    });

    it('Should parse 13.12(number) to 13.12(number)', function () {
      assert.equal(Utilities.parseStyleDimension(13.12, false), 13.12);
    });

    it('Should parse "13,12"(string) to 13.12(number)', function () {
      assert.equal(Utilities.parseStyleDimension('13,12', false), 13.12);
    });

    it('Should parse "13,12px"(string) to 13.12(number)', function () {
      assert.equal(Utilities.parseStyleDimension('13,12px', false), 13.12);
    });

    it('Should parse ""(empty string) to 0(number)', function () {
      assert.equal(Utilities.parseStyleDimension('', false), 0);
    });

    it('Should parse "undefined" to 0(number)', function () {
      assert.equal(Utilities.parseStyleDimension(void (0), false), 0);
    });

    it('Should parse "null" to 0(number)', function () {
      assert.equal(Utilities.parseStyleDimension(null, false), 0);
    });

    it('Should parse {}(object) to 0(number)', function () {
      assert.equal(Utilities.parseStyleDimension({}, false), 0);
    });

    it('Should parse "12em"(string) to 12(number)', function () {
      assert.equal(Utilities.parseStyleDimension('12em', true), 12);
    });

    it('Should parse ""(empty string) to ""(empty string)', function () {
      const toParse = '';
      assert.equal(Utilities.parseStyleDimension(toParse, true), toParse);
    });

    it('Should parse "undefined" to "undefined"', function () {
      assert.equal(Utilities.parseStyleDimension(void (0), true), void (0));
    });

    it('Should parse "null" to "null"', function () {
      assert.equal(Utilities.parseStyleDimension(null, true), null);
    });

    it('Should parse {}(object) to {}(object)', function () {
      var obj = {};
      assert.deepEqual(Utilities.parseStyleDimension(obj, true), obj);
    });
  });


});
