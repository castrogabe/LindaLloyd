import mongoose from 'mongoose';

const emailItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // Assuming you want to store image URL or path
});

const emailListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emails: [{ type: String, required: true }],
  name: { type: String, required: true },
  items: [emailItemSchema], // Array of email items with descriptions, prices, images, and URLs
});

const EmailList = mongoose.model('EmailList', emailListSchema);

export default EmailList;
