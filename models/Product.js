// models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  name: {
    en: { type: String, required: true },
    ru: { type: String, required: true },
    pl: { type: String, required: true },
    uk: { type: String, required: true },
  },
  description: {
    en: { type: String },
    ru: { type: String },
    pl: { type: String },
    uk: { type: String },
  },
  composition: {
    en: { type: String },
    ru: { type: String },
    pl: { type: String },
    uk: { type: String },
  },
  calories: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
