const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  name: String,
  ingredients: [{quantity: String, unit: String, itemName: String}],
  directions: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('recipe', RecipeSchema);