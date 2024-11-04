import { ObjectId } from "mongoose";
import { Message } from "../schemas/Message";

type MessageMongo = Message & {
  to: any;
}

interface IRequest {
  messages: MessageMongo[];
  user_logged_id: string;
}

class UpdateReadMessageService {
  public async execute({ messages, user_logged_id }: IRequest) {
    const unreadMessages = messages.filter(msg => {
      return ((msg.to._id.toString() !== user_logged_id.toString()) && !msg.read)
    })

    // unreadMessages.forEach(async msg => {
    //   await Message.findOneAndUpdate(
    //     {
    //       _id: msg._id,
    //     },
    //     {
    //       $set: { read: true },
    //     },
    //   );
    // })

    const response = () => {
      const promise = unreadMessages.map(async (message) => {
        return Message.findOneAndUpdate(
          {
            _id: message._id,
          },
          {
            $set: { read: true },
          },
          {
            new: true,
          }
        );
      })

      return Promise.all(promise);
    }

    const readMessages = await response()

    return readMessages;
  }
}

export { UpdateReadMessageService };
