const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String },
    carrier: { type: String, default: '' },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
