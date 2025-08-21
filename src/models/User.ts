import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required.'],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
  companyName: {
    type: String,
  },
  businessType: {
    type: String,
  },
  plan: {
    type: String,
    default: 'free',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
