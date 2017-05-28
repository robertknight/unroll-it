'use strict';

/**
 * Helper for writing parameterized tests.
 *
 * This is a wrapper around the `it()` function for creating a Mocha test case
 * which takes an array of fixture objects and calls it() once for each fixture,
 * passing in the fixture object as an argument to the test function.
 *
 * @param {string} description - Description with optional '#key' placeholders
 *        which are replaced by the values of the corresponding key from each
 *        fixture object.
 * @param {Function} testFn - Test function which can accept either `fixture`
 *        or `done, fixture` as arguments, where `done` is the callback for
 *        reporting completion of an async test and `fixture` is an object
 *        from the `fixtures` array.
 * @param {Array<T>} fixtures - Array of fixture objects.
 * @param {Function} [itFn] - Custom `it` function. Defaults to `it`.
 */
function unroll(description, testFn, fixtures, itFn) {
  if (!itFn && typeof it === 'function') {
    itFn = it;
  }

  fixtures.forEach(function (fixture) {
    var caseDescription = Object.keys(fixture).reduce(function (desc, key) {
      return desc.replace('#' + key, String(fixture[key]));
    }, description);
    itFn(caseDescription, function (done) {
      if (testFn.length === 1) {
        // Test case does not accept a 'done' callback argument, so we either
        // call done() immediately if it returns a non-Promiselike object
        // or when the Promise resolves otherwise
        var result = testFn(fixture);
        if (typeof result === 'object' && result.then) {
          result.then(function () { done(); }, done);
        } else {
          done();
        }
      } else {
        // Test case accepts a 'done' callback argument and takes responsibility
        // for calling it when the test completes.
        testFn(done, fixture);
      }
    });
  });
}

module.exports = unroll;
