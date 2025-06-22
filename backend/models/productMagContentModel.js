import mongoose from 'mongoose';

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

export default ProductMagContent;
