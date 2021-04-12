const mongoose = require('mongoose');

const Shopping_ListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  name: String,
  items: [{quantity: String, unit: String, itemName: String}],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('shopping_list', Shopping_ListSchema);