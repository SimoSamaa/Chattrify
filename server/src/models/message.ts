import mongoose, { Document, ObjectId } from 'mongoose';
const { ObjectId } = mongoose.Types;

interface IMessage extends Document {
  sender: ObjectId;
  message: string;
  conversation: ObjectId;
  files: string[];
};

const messageSchema = new mongoose.Schema<IMessage>({
  sender: {
    ref: 'User',
    type: ObjectId,
  },
  message: {
    type: String,
    trim: true,
  },
  conversation: {
    ref: 'Conversation',
    type: ObjectId,
  },
  files: []
},
  {
    collection: 'messages',
    timestamps: true,
  }
);

const Message = mongoose.models.message || mongoose.model('Message', messageSchema);

export default Message;
export type { IMessage };