/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
const mongoose = require('mongoose');
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  // mongoose boilerplate
mongoose.connect(MONGODB_CONNECTION_STRING);
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  comments: [String],
  commentcount: Number,
});

const Book = mongoose.model('Book', bookSchema);

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, (err, docs) => {
        if(err) {
          res.send(err);
        }else {
          //console.log(docs);
          res.json({books: docs});
        }
      });
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(title == '') {
        res.send('please enter a book title');
      }else {
      Book.create({title, comments: [], commentcount: 0}, (err, doc) => {
        if(err) {
          res.send(err);
        }else {
          res.json({title: doc.title, _id: doc._id, commentcount: doc.commentcount});
        }
      });
    }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err, data) => {
        if(err) {
          res.send(err);
        }else {
          res.send('complete delete successful');
        }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, (err, doc) => {
        if(err) {
          res.send('book id not found');
        }else {
          res.json({
            _id: doc._id,
            title: doc.title,
            comments: doc.comments,
            commentcount: doc.commentcount
          });
        }
      });
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      Book.findById(bookid, (err, book) => {
        if(err) {
          console.log(err);
        }else {
          book.comments.push(comment);
          book.commentcount = book.comments.length;
          book.save((error, doc) => {
            if(err) {
              res.send(err);
            }else {
          res.json({
            _id: doc._id,
            title: doc.title,
            comments: doc.comments,
            commentcount: doc.commentcount
          });
        }
        });
      }
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndDelete(bookid, (err, doc) => {
        if(err) {
          res.send(err);
        }else {
          res.send('delete successful');
        }
      });
    });
  
};
