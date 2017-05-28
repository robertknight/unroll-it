'use strict';

const { assert } = require('chai');
const { stub, assert: sinonAssert } = require('sinon');

const unroll = require('../index');

describe('unroll', () => {
  it('should register one test for each test case', () => {
    const itFn = stub();
    const testCases = [1, 2, 3];
    const testFn = stub();

    unroll('a description', testFn, testCases, itFn);

    assert.deepEqual(itFn.callCount, 3);
    for (let i=0; i < testCases.length; i++) {
      assert.deepEqual(itFn.args[i][0], 'a description');

      // Call test function registered by `unroll()` and verify args passed to
      // it.
      itFn.args[i][1]();
      assert.deepEqual(testFn.lastCall.args, [undefined, testCases[i]]);
    }
  });

  it('should replace placeholders in the description', () => {
    const itFn = stub();
    const testCases = [{
      input: 'foo',
      output: 'bar',
    }];
    const testFn = stub();

    unroll('testFn applied to #input should return #output', testFn, testCases, itFn);

    sinonAssert.calledOnce(itFn);
    assert.equal(itFn.args[0][0], 'testFn applied to foo should return bar');
  });

  describe('async test support', () => {
    it('should support test functions that return a Promise', () => {
      const itFn = stub();
      const testCases = [1, 2, 3];
      const testFn = (v) => Promise.resolve(v);

      unroll('async test', testFn, testCases, itFn);

      // Call tests registered by `unroll()`, passing `done` callback to invoke
      // after returned Promise resolves.
      const doneFn = stub();
      [0, 1, 2].map((i) => itFn.args[i][1](doneFn));

      assert.equal(doneFn.callCount, 0);
      return Promise.resolve().then(() => {
        assert.equal(doneFn.callCount, 3);
      });
    });

    it('should support test functions that accept a `done()` argument', () => {
      const itFn = stub();
      const testCases = [1, 2, 3];
      const doneCallbacks = [];
      const testFn = (done, v) => doneCallbacks.push(done);

      unroll('async test', testFn, testCases, itFn);

      // Call tests registered by `unroll()`, passing `done` callback to invoke
      // after async test completes.
      const doneFn = stub();
      [0, 1, 2].map((i) => itFn.args[i][1](doneFn));

      assert.equal(doneFn.callCount, 0);
      doneCallbacks.forEach(cb => cb());
      assert.equal(doneFn.callCount, 3);
    });
  });
});
