const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    update_time: { type: String },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    replied: { type: Boolean, default: false },
    replyContent: { type: String },
    replyEmail: { type: String },
    replySentAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
