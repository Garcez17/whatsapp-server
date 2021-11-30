import { injectable } from "tsyringe";
import { Message } from "../schemas/Message";

@injectable()
export class GetMessagesByChatRoomService {
  public async execute(roomId: string) {
    return Message.find({
      roomId,
    }).populate('to').exec();
  }
}
