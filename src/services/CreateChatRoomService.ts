import { injectable } from "tsyringe";
import { ChatRoom } from "../schemas/ChatRoom";

type IRequest = {
  idUsers: string[]
  isPrivate?: boolean
  idAdmin?: string
  name?: string
  userLimit?: number
  idleTime?: number
}

type UserDate = {
  [x: string]: Date
}

@injectable()
export class CreateChatRoomService {
  public async execute(data: IRequest) {
    function toObject(arr: string[]) {
      let object = {} as UserDate;

      arr.forEach(item => {
        object[item] = new Date()
      })

      return object;
    }

    const room = await ChatRoom.create({
      ...data,
      idUsersJoinedAt: toObject(data.idUsers),
      idUsersLastMessage: toObject(data.idUsers),
    });

    return room;
  }
}
