const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;
const server = require('../lib/http-server');

const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');


describe('API responds correctly to the four principal REST methods', () => {

  const request = chai.request(server);

  const filePath = path.resolve(__dirname, '../lib/store/test*');
  const rmv = done => rimraf(filePath, done);

  before(done => {
    mkPath = path.join(__dirname, '../lib/store');
    mkdirp(mkPath);
    rmv(done);
  }
    );

  after(rmv);


  const testPost = {
    title: 'test title one',
    author: 'test author1',
  }; 
  const testPut = {
    title: 'test title one',
    author: 'test author2',
  };

  const testName = testPost.title.replace(/\s/g, '_');

  it('responds appropriately to GET directory requests', (done) => {
    
    request
      .get('/lib/store')
      .then(res => {
        let body = res.body;
        assert.deepEqual(body, [ 'Life_on_the_Mississippi.json' ]);
        done();
      })
      .catch(done);

  });

  it('responds appropriately to POST requests', (done) => {

    request
      .post('/lib/store')
      .send(testPost)
      .catch(done);

    request
      .get('/lib/store')
      .then(res => {
        let body = res.body;
        assert.deepEqual(body, [ 'Life_on_the_Mississippi.json', 'test_title_one.json' ]);
        done();
      })
      .catch(done);

  });


  it('responds appropriately to GET file reqs', (done) => {
    request
      .get('/lib/store/' + testName + '.json')
      .then(res => {
        let body = '';
        body = res.body;
        assert.deepEqual(res.body, { title: 'test title one', author: 'test author1' });
        done();
      })
      .catch(done);

  });

  it('responds appropriately to PUT requests', (done) => {

    request
      .put('/lib/store/' + testName + '.json')
      .send(testPut)
      .then(res => {
        let body = '';
        body = res.body;
        assert.equal(body.author, testPut.author);
        done();
      })
      .catch(done);

  });

  it('responds appropriately to DELETE requests', (done) => {

    request
      .delete('/lib/store/' + testName + '.json')
      .catch(done);

    request
      .get('/lib/store')
      .then(res => {
        let body = '';
        body = res.body;
        assert.deepEqual(body, [ 'Life_on_the_Mississippi.json' ]);
        done();
      })
      .catch(done);

  });

});