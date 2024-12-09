import mongoose, { Document, ObjectId } from 'mongoose';
const { ObjectId } = mongoose.Types;

interface IConversation extends Document {
  name: string;
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
  isGroup: {
    type: Boolean,
    required: true,
    default: false,
  },
  users: [
    {
      type: ObjectId,
      ref: 'Users',
    }
  ],
  latestMessage: {
    type: ObjectId,
    ref: 'Messages',
  },
  admin: {
    type: ObjectId,
    ref: 'Users',
  },
}, {
  collection: 'conversations',
  timestamps: true,
});

const Conversation = mongoose.models.conversations || mongoose.model('Conversation', conversationSchema);

export default Conversation;
export type { IConversation };