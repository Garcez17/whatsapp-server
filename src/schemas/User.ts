import { v4 as uuid } from 'uuid';
import mongoose, { Document, Schema } from "mongoose";

type User = Document & {
  id: string;
  email: string;
  socket_id: string;
  name: string;
  avatar: string;
  is_online: boolean;
}

const UserSchema = new Schema({
  id: {
    type: String,
    default: uuid,
  },
  email: String,
  socket_id: String,
  name: String,
  avatar: String,
  is_online: Boolean,
});

const User = mongoose.model<User>('Users', UserSchema);

export { User };
