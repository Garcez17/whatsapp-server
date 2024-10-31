import mongoose, { Document, Schema } from 'mongoose';
import { User } from './User';
import { v4 as uuid } from 'uuid';

type ChatRoom = Document & {
  idChatRoom: string;
  idMembers: string[];    // (aka idUsers) - deal with this prop whenever a given participant leaves or joins the chatroom
  idAdmin: User;         //  similar behaviour as stated above
  idBanned: User[];
  idUsersJoinedAt: Map<string, Date>;
  idUsersLastMessage: Map<string, Date>;
  name?: string;
  isPrivate: boolean;
  description?: string;
  createdAt: Date;
  messagesCount: number;
  userLimit: number;
  idleTime: number;
}

const ChatRoomSchema = new Schema({

  idChatRoom: {
    type: String,
    default: uuid,
  },

  idMembers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],

  idAdmin: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
  },

  idBanned: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],

  idUsersJoinedAt: {
    type: Schema.Types.Map,
    of: Schema.Types.Date
  },

  idUsersLastMessage: {
    type: Schema.Types.Map,
    of: Schema.Types.Date
  },

  name: {
    type: String,
  },

  isPrivate: {
    type: Boolean,
    required: true,
    default: true,
  },

  description: {
    type: String,
    default: '',
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  
  messagesCount: {
    type: Number,
    default: 0,
  },

  userLimit: {
    type: Number,
    default: 2,
    max: 50,
  },

  idleTime: {
    type: Number,
    required: true,
    default: 10,
  },

});

const ChatRoom = mongoose.model<ChatRoom>("ChatRooms", ChatRoomSchema);

export { ChatRoom };