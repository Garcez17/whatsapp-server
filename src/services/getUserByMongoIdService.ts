import { injectable } from "tsyringe";
import { User } from "../schemas/User";

@injectable()
export class GetUserByMongoIdService {
  public async execute(_id: string): Promise<User | null> {
    return User.findOne({ _id });
  }
}
