const mongoose = require('mongoose');

const SparePartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: false}
});

module.exports = mongoose.model('SparePart', SparePartSchema);