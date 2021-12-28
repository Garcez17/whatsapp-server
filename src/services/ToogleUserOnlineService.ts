import { injectable } from "tsyringe";
import { User } from "../schemas/User";

type IRequest = {
  email: string;
  socket_id: string;
  is_online: boolean;
}

@injectable()
export class ToogleUserOnlineService {
  public async execute({ email, socket_id, is_online }: IRequest): Promise<User | null> {
    return User.findOneAndUpdate(
      {
        email
      },
      {
        $set: { is_online, socket_id }
      },
      {
        new: true,
      }
    );
  }
}
