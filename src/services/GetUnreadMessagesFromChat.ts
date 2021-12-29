import { Message } from "../schemas/Message";

interface IRequest {
  roomId: string;
  user_id: string;
}

class GetUnreadMessagesFromChat {
  public async execute({ roomId, user_id }: IRequest) {
    const messages = await Message.find({
      roomId,
      to: user_id,
    }).exec();

    const lastMessage = messages.slice(-1)[0];
    const unreadMessages = messages.filter(message => !message.read).length;

    return {
      lastMessage,
      unreadMessages,
    }
  }
}

export { GetUnreadMessagesFromChat };
