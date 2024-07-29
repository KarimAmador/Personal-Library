/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const { default: mongoose } = require('mongoose');
const Book = require('../models/books.js');

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      try {
        const bookArray = await Book.find().select({__v: 0}).exec();

        res.json(bookArray);
      } catch (err) {
        console.log(err);
        res.json({error: err.message});
      }
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async function (req, res){
      let title = req.body.title;

      if (!title) return res.type('text').send('missing required field title');

      try {
        const newBook = new Book(req.body);
        const result = await newBook.save();
        
        res.json({_id: result._id, title: result.title});
      } catch (err) {
        console.log(err);
        res.json({error: err.message});
      }
      //response will contain new book object including atleast _id and title
    })
    
    .delete(async function(req, res){
      try {
        await Book.deleteMany();
  
        res.type('text').send('complete delete successful');
      } catch (err) {
        console.log(err);
        res.json({error: err.message});
      }
      //if successful response will be 'complete delete successful'
    });

  // Custom error for non-existing book
  const NoBookExists = new Error('no book exists');

  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;

      try {
        if (!mongoose.isValidObjectId(bookid)) throw NoBookExists;

        let result = await Book.findById(bookid).select(['_id', 'title', 'comments']).exec();
        
        if (!result) throw NoBookExists;

        res.json(result)
      } catch (err) {
        console.log(err);
        res.type('text').send(err.message);
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) return res.type('text').send('missing required field comment');

      try {
        if (!mongoose.isValidObjectId(bookid)) throw NoBookExists;

        let book = await Book.findById(bookid);

        if (!book) throw NoBookExists;

        book.comments.push(comment);
        book.$inc('commentcount', 1);

        await book.save();

        res.json({ _id: book._id, title: book.title, comments: book.comments });
      } catch (err) {
        console.log(err);
        res.type('text').send(err.message);
      }
      //json res format same as .get
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;

      try {
        if (!mongoose.isValidObjectId(bookid)) throw NoBookExists;

        let result = await Book.findByIdAndDelete(bookid);

        if (!result) throw NoBookExists;

        res.type('text').send('delete successful');
      } catch (err) {
        console.log(err);
        res.type('text').send(err.message);
      }
      //if successful response will be 'delete successful'
    });
  
};
