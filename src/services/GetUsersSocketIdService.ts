import { injectable } from "tsyringe";
import { User } from "../schemas/User";

@injectable()
export class GetUsersSocketIdService {
  public async execute(user_ids: string[]): Promise<string[]> {
    const results = await User.find(
      { _id: { $in: user_ids } },
      { socket_id: 1, _id: 0 }
    );

    const socketIds = results.map(result => result.socket_id);

    return socketIds;
  }
}
