const { Schema, model } = require('mongoose');

const bookSchema = new Schema({
  title: {
    required: true,
    type: String
  },
  comments: [String],
  commentcount: {
    type: Number,
    default: 0
  }
});

const Book = model('Book', bookSchema, 'library');

module.exports = Book;
