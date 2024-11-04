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
export class GetAllGroupsService {
  public async execute({ user_id }: IRequest) {
    const user = await User.findOne({ _id: user_id }) as User;

    const rooms = await ChatRoom.find({
      idUsers: {
        $in: [user]
      },
      isPrivate: false
    }).populate('idUsers');

    const response = () => {
      const promise = rooms.map(async (group) => {
        const messages = await Message.find({
          roomId: group.idChatRoom,
        }).exec();

        const lastMessage = messages.slice(-1)[0];
        const unreadMessages = messages.filter(msg => msg.read).length;

        return { group, lastMessage, unreadMessages };
      })

      return Promise.all(promise);
    }

    return response();
  }
}
