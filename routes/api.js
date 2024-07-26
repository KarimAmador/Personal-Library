/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
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

      if (!title) return res.status(400).type('text').send('missing required field title');

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



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
