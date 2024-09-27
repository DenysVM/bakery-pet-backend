const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    en: { type: String },
    ru: { type: String },
  },
  image: {
    type: String,
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
