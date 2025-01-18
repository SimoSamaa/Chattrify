import mongoose, { Document, ObjectId } from 'mongoose';
const { ObjectId } = mongoose.Types;

interface IConversation extends Document {
  name: string;
  picture: string;
  isGroup: boolean;
  users: ObjectId[];
  latestMessage: ObjectId;
  admin: ObjectId;
};

const conversationSchema = new mongoose.Schema<IConversation>({
  name: {
    type: String,
    required: [true, 'Conversation name is required'],
    trim: true,
  },
  picture: {
    type: String,
    required: true,
  },
  isGroup: {
    type: Boolean,
    required: true,
    default: false,
  },
  users: [
    {
      type: ObjectId,
      ref: 'User',
    }
  ],
  latestMessage: {
    type: ObjectId,
    ref: 'Message',
  },
  admin: {
    type: ObjectId,
    ref: 'User',
  },
}, {
  collection: 'conversations',
  timestamps: true,
});

const Conversation = mongoose.models.conversations || mongoose.model('Conversation', conversationSchema);

export default Conversation;
export type { IConversation };