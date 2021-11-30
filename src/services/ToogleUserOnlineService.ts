import { injectable } from "tsyringe";
import { User } from "../schemas/User";

type IRequest = {
  email: string;
  socket_id: string;
  value: boolean;
}

@injectable()
export class ToogleUserOnlineService {
  public async execute({ email, socket_id, value }: IRequest): Promise<User | null> {
    return User.findOneAndUpdate(
      {
        email
      },
      {
        $set: { is_online: value, socket_id }
      },
      {
        new: true,
      }
    );
  }
}
