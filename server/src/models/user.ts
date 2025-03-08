import mongoose, { Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  picture?: string;
  status?: string;
};

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    maxLength: [64, 'Password must be at most 64 characters long'],
  },
  picture: {
    type: String,
    default: 'https://res.cloudinary.com/dmhcnhtng/image/upload/v1643044376/avatars/default_pic_jeaybr.png',
  },
  status: {
    type: String,
    default: 'He there! I am using Chattrify.',
  },
}, {
  collection: 'users',
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
export type { IUser };