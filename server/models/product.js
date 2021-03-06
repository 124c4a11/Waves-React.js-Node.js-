const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: 1,
    maxlength: 100
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true,
    maxlength: 255
  },

  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },

  wood: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wood',
    required: true
  },

  frets: {
    type: Number,
    required: true
  },

  shipping: {
    type: Boolean,
    required: true
  },

  available: {
    type: Boolean,
    required: true
  },

  sold: {
    type: Number,
    maxlength: 100,
    default: 0
  },

  publish: {
    type: Boolean,
    required: true
  },

  images: {
    type: Array,
    default: []
  }
}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema);
