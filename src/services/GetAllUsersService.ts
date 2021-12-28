import { ObjectId } from "mongoose";
import { injectable } from "tsyringe";
import { ChatRoom } from "../schemas/ChatRoom";
import { Message } from "../schemas/Message";
import { User } from "../schemas/User";

interface IRequest {
  user_id: string;
}

interface IResponse {
  data: Array<{
    user: User;
    lastMessage: Message;
    notifications: number;
  }>
}

@injectable()
export class GetAllUsersService {
  public async execute({ user_id }: IRequest) {
    const user = await User.findOne({ _id: user_id }) as User;

    const rooms = await ChatRoom.find({
      idUsers: {
        $in: [user]
      }
    });

    console.log(rooms);

    const contactsIds = rooms.map(room => room.idUsers.find(contact_id => contact_id.toString() !== user._id.toString()));

    console.log(contactsIds);

    const contacts = await User.find({
      _id: {
        $in: contactsIds
      }
    }).exec();

    const response = () => {
      const promise = contacts.map(async (contact, index) => {
        const messages = await Message.find({
          roomId: rooms[index].idChatRoom,
        }).exec();

        const lastMessage = messages.slice(-1)[0];
        const unreadMessages = messages.filter(msg => msg.to.toString() === contact._id.toString()).length;

        return { contact, lastMessage, unreadMessages };
      })

      return Promise.all(promise);
    }

    const test = await response();

    return response();
  }
}
