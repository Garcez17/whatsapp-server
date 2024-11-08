import { injectable } from "tsyringe";
import { ChatRoom } from "../schemas/ChatRoom";
import { User } from "../schemas/User";

@injectable()
export class GetGroupsService {
  public async execute(user_id?: string) {
    if (user_id) {
      const user = await User.findOne({ _id: user_id }) as User;

      const rooms = await ChatRoom.find({
        isPrivate: false,
        idBanned: {
          $not: {
            $in: [user]
          }
        }
      })

      return rooms
    } else {
      const rooms = await ChatRoom.find({
        isPrivate: false,
      })

      return rooms
    }

  }
}