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

    shippingAddress: {
      fullName: { type: String },
      address: { type: String },
      city: { type: String },
      states: { type: String },
      county: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
