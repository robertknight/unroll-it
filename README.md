# Unroll It

Simple helper function for writing data-driven / parametrized unit tests in
Mocha.

## Introduction

Mocha does not have explicit support writing parametrized tests. Instead it
suggests using imperative code to [dynamically generate test
cases.](https://mochajs.org/#dynamically-generating-tests)

This module provides a helper function which is a wrapper around the `it()`
function for declaratively creating data-driven tests. The end result is the
same as in the example in [Mocha's
documentation](https://mochajs.org/#dynamically-generating-tests) but the code
is shorter and hopefully easier to read. My experience has been that having an
explicit method for creating data-driven tests tends to promote their use in a
codebase.

## Installation

```sh
npm install unroll-it
```

## Usage

_unroll-it_ exports a function that is used in place of the "it" function to
create a test which is run once for each case in an array of test cases. The
syntax is:

```js
unroll(description, testFunction, testCases);
```

Each test case is an object which is passed to the `testFunction`. The properties
in the test case may also be referenced in the `description`.

Here is a simple synchronous test:

```js
var { assert } = require('chai');
var unroll = require('unroll-it');

describe('String#toUpperCase', () => {
  unroll('should return #output given #input', (testCase) => {
    assert.equal(testCase.input.toUpperCase(), testCase.output);
  },[{
    input: 'john',
    output: 'JOHN',
  },{
    input: 'mark',
    output: 'MARK',
  }]);
});
```

The "#output" and "#input" placeholders will be replaced with the corresponding
values from the test case.

### Asynchronous tests

Similar to the `it()` function in Mocha, asynchronous tests can be written
either by returning a `Promise` from the test function or by accepting a
`done()` callback as the first argument to the test function which is called
when the test completes.
