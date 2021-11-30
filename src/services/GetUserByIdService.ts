import { injectable } from "tsyringe";
import { User } from "../schemas/User";

@injectable()
export class GetUserByIdService {
  public async execute(id: string): Promise<User | null> {
    return User.findOne({ id });
  }
}
