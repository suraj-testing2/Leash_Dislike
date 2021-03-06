/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

goog.module('goog.testing.MockControlTest');
goog.setTestOnly();

const Mock = goog.require('goog.testing.Mock');
const MockControl = goog.require('goog.testing.MockControl');
const testSuite = goog.require('goog.testing.testSuite');

// Emulate the behavior of a mock.
class MockMock {
  constructor() {
    this.replayCalled = false;
    this.resetCalled = false;
    this.verifyCalled = false;
    this.tearDownCalled = false;
  }
}

MockMock.prototype.$replay = function() {
  this.replayCalled = true;
};

MockMock.prototype.$reset = function() {
  this.resetCalled = true;
};

MockMock.prototype.$verify = function() {
  this.verifyCalled = true;
};

testSuite({
  setUp() {
    const mock = new Mock(MockMock);
  },

  testAdd() {
    const mockMock = new MockMock();

    const control = new MockControl();
    assertEquals(mockMock, control.addMock(mockMock));
  },

  testReplayAll() {
    const mockMock1 = new MockMock();
    const mockMock2 = new MockMock();
    const mockMockExcluded = new MockMock();

    const control = new MockControl();
    control.addMock(mockMock1);
    control.addMock(mockMock2);

    control.$replayAll();
    assertTrue(mockMock1.replayCalled);
    assertTrue(mockMock2.replayCalled);
    assertFalse(mockMockExcluded.replayCalled);
  },

  testResetAll() {
    const mockMock1 = new MockMock();
    const mockMock2 = new MockMock();
    const mockMockExcluded = new MockMock();

    const control = new MockControl();
    control.addMock(mockMock1);
    control.addMock(mockMock2);

    control.$resetAll();
    assertTrue(mockMock1.resetCalled);
    assertTrue(mockMock2.resetCalled);
    assertFalse(mockMockExcluded.resetCalled);
  },

  testVerifyAll() {
    const mockMock1 = new MockMock();
    const mockMock2 = new MockMock();
    const mockMockExcluded = new MockMock();

    const control = new MockControl();
    control.addMock(mockMock1);
    control.addMock(mockMock2);

    control.$verifyAll();
    assertTrue(mockMock1.verifyCalled);
    assertTrue(mockMock2.verifyCalled);
    assertFalse(mockMockExcluded.verifyCalled);
  },

  testTearDownAll() {
    const mockMock1 = new MockMock();
    const mockMock2 = new MockMock();
    const mockMockExcluded = new MockMock();

    // $tearDown is optional.
    mockMock2.$tearDown = function() {
      this.tearDownCalled = true;
    };
    mockMockExcluded.$tearDown = function() {
      this.tearDownCalled = true;
    };

    const control = new MockControl();
    control.addMock(mockMock1);
    control.addMock(mockMock2);

    control.$tearDown();

    // mockMock2 has a tearDown method and is in the control.
    assertTrue(mockMock2.tearDownCalled);
    assertFalse(mockMock1.tearDownCalled);
    assertFalse(mockMockExcluded.tearDownCalled);
  },
});
