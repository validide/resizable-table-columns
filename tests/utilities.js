/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai/index.d.ts" />

import { assert } from 'chai';
import Utilities from '../dist/js/es6/utilities';

describe('Utilities', function() {
  describe('Utilities.escapeRegExp', function() {
    it('Should not change "randomText"', function() {
      assert.equal(Utilities.escapeRegExp('randomText'), 'randomText');
    });

    it('Should change "random-text\\" to "random\\-text\\\\"', function() {
      assert.equal(Utilities.escapeRegExp('random-text\\'), 'random\\-text\\\\');
    });

    it('Should change "random.text" to "random\\.text"', function() {
      assert.equal(Utilities.escapeRegExp('random.text'), 'random\\.text');
    });
  });
});
