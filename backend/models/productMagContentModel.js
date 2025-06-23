const mongoose = require('mongoose');

const productMagContentSchema = new mongoose.Schema({
  sections: [
    {
      title: { type: String, required: true },
      paragraphs: [{ type: String, required: true }],
    },
  ],
});

const ProductMagContent = mongoose.model(
  'ProductMagContent',
  productMagContentSchema
);

module.exports = ProductMagContent;
