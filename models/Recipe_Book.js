const mongoose = require('mongoose');

const Recipe_BookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  name: String,
  recipes: Array,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('recipe_book', Recipe_BookSchema);