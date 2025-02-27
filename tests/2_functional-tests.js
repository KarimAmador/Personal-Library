/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { ObjectId } = require('mongoose').Types;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
    let bookid;

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: 'Title'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id', 'Response should contain _id');
            assert.property(res.body, 'title', 'Response should contain title');

            bookid = res.body._id;

            done();
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: ''})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], 'comments', 'Books in array should contain comments');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get(`/api/books/${new ObjectId().toString()}`)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get(`/api/books/${bookid}`)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.property(res.body, '_id', 'Books in array should contain _id');
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, 'comments', 'Books in array should contain commentcount');
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      let comment = 'This is a comment';

      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post(`/api/books/${bookid}`)
          .send({comment})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id', 'Response should contain _id');
            assert.property(res.body, 'title', 'Response should contain title');
            assert.property(res.body, 'comments', 'Response should contain comments Array');
            assert.isNotEmpty(res.body.comments, 'comments should not be empty');
            assert.equal(res.body.comments[res.body.comments.length - 1], comment, 'comments should contain the new comment');
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post(`/api/books/${bookid}`)
          .send({comment: ''})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment');
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post(`/api/books/${new ObjectId().toString()}`)
          .send({comment})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete(`/api/books/${bookid}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .delete(`/api/books/${new ObjectId().toString()}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          })
      });

    });

  });

});
