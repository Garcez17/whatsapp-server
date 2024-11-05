import { injectable } from "tsyringe";
import { ChatRoom } from "../schemas/ChatRoom";

@injectable()
export class GetGroupsService {
  public async execute() {
    const rooms = await ChatRoom.find({
      isPrivate: false
    })

    return rooms
  }
}