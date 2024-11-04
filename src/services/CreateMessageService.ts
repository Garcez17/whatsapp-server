import { injectable } from "tsyringe";
import { Message } from "../schemas/Message";
import { ChatRoom } from "../schemas/ChatRoom";

type IRequest = {
  to: string;
  text: string;
  roomId: string;
}

@injectable()
export class CreateMessageService {
  public async execute(data: IRequest) {
    await ChatRoom.updateOne(
      {idChatRoom: data.roomId},
      [
        {$set: {[`idUsersLastMessage.${data.to}`]: new Date()}}
      ]
    )

    return Message.create(data);
  }
}
