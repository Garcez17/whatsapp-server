import { ObjectId } from "mongoose";
import { injectable } from "tsyringe";
import { ChatRoom } from "../schemas/ChatRoom";

@injectable()
export class GetChatRoomByUsersService {
  public async execute(idUsers: ObjectId[]) {
    return ChatRoom.findOne({
      idUsers: {
        $all: idUsers,
      }
    }).exec();
  }
}
