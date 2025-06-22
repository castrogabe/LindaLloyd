import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, sparse: true }, // Unique only if provided
    phone: { type: String },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
