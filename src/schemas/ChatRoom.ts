import mongoose, { Document, Schema } from 'mongoose';
import { User } from './User';
import { v4 as uuid } from 'uuid';

type ChatRoom = Document & {
  idChatRoom: string;
  idUsers: User[];
  idAdmins: User[];     // manipular quando um nó adm surgir ou cair
  idBanned: User[];
  idKickedOut: User[];
  name: string;
  isPrivate: boolean;   // conversa particular x grupo
  description?: string;
  createdAt: Date;
  messagesCount: number;
  userLimit: number;
  // lastMessageAt?: Date; depois pensar na modelagem de nó ocioso
}

const ChatRoomSchema = new Schema({
  idUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],

  idAdmins: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    }
  ],

  idBanned: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    }
  ],

  idKickedOut: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    }
  ],

  idChatRoom: {
    type: String,
    default: uuid,
  },

  name: {
    type: String,
    required: true,
  },

  isPrivate: {
    type: Boolean,
    required: true,
    default: false,
  },

  description: {
    type: String,
    default: '',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  
  messagesCount: {
    type: Number,
    default: 0,
  },

  userLimit: {
    type: Number,
    required: true,
    default: 2,
    max: 50,
  },
});

const ChatRoom = mongoose.model<ChatRoom>("ChatRooms", ChatRoomSchema);

export { ChatRoom };