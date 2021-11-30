import { injectable } from "tsyringe";
import { User } from "../schemas/User"

type IRequest = {
  email: string;
  socket_id: string;
  avatar: string;
  name: string;
}

@injectable()
export class CreateUserService {
  public async execute({ email, name, avatar, socket_id }: IRequest) {
    const userAlreadyExists = await User.findOne({
      email,
    }).exec();

    if (userAlreadyExists) {
      const user = await User.findOneAndUpdate(
        {
          _id: userAlreadyExists._id,
        },
        {
          $set: { name, avatar, socket_id },
        },
        {
          new: true,
        }
      );

      return user;
    } else {
      const user = await User.create({
        email,
        name,
        avatar,
        socket_id,
      });

      return user;
    }
  }
}
