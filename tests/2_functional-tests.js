/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

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
        assert.isArray(res.body.books, 'response should be an array');
        assert.property(res.body.books[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body.books[0], 'title', 'Books in array should contain title');
        assert.property(res.body.books[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({
          title: "Functional Test"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.title, "Functional Test");
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({
          title: ''
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'please enter a book title');
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body.books, 'response should be an array');
          assert.property(res.body.books[0], 'title', 'book should contain a title');
          assert.property(res.body.books[0], 'commentcount', 'book should contain a comment count');
          assert.property(res.body.books[0], '_id', 'book should conatain an id');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/12345')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'book id not found');
          done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .post('/api/books')
        .send({
          title: 'Test Get With Id'
        })
        .end((err, res) => {
          chai.request(server)
          .get('/api/books/' + res._id)
          .end((error, response) => {
            assert.equal(response.status, 200);
            assert.equal(response._id, res._id);
            done();
          });
        });

      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books')
        .send({
          title: 'Test Add Comments'
        })
        .end((err, res) => {
          chai.request(server)
          .post('/api/books/' + res._id)
          .send({
            comments: 'This is a test comment'
          })
          .end((error, response) => {
            assert.equal(response.status, 200);
            assert.equal(response.comments[0], 'This is a test comment');
            assert.equal(response._id, res._id);
            assert.equal(response.commentcount, 1);
            done();
          });
          done();
        });

      });
      
    });

  });

});
