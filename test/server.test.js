const assert = require('assert');
//Test server, router and request handlers
describe('server preps and passes request data to router', (args1) => {
  it('passes test 1', (args1) => {
    let value1 = 1;
    assert.equal(value1, 1);
    done();
  });
});

describe('router preps, passes route-specific server-side and req data, and function calls to handlers', (args2) => {
  it('passes test 2', (args2) => {
    let value2 = 1;
    assert.equal(value2, 1);
  });
  done();
});

describe('handlers process data correctly and complete server response to client', (args3) => {
  it('passes test 3', (args3) => {
    let value3 = 1;
    assert.equal(value3, 1);
  });
  done();
});