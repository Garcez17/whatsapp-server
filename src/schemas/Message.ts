import mongoose, { Document, Schema } from 'mongoose';

type Message = Document & {
  to: string;
  text: string;
  created_at: Date;
  room_id: string;
  read: boolean;
}

const MessageSchema = new Schema({
  to: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
  text: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
  roomId: {
    type: String,
    ref: 'ChatRoom',
  },
  read: {
    type: Boolean,
    default: false,
  },
});

const Message = mongoose.model<Message>("Messages", MessageSchema);

export { Message };
