import { injectable } from "tsyringe";
import { ChatRoom } from "../schemas/ChatRoom";

@injectable()
export class GetChatRoomByIdService {
  public async execute(idChatRoom: string): Promise<ChatRoom | null> {
    return ChatRoom.findOne({
      idChatRoom,
    }).populate('idUsers').exec();
  }
}
