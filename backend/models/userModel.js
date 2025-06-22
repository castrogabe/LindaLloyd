import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    notes: { type: String, default: '' }, // Ensure notes are stored
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
