import { injectable } from "tsyringe";
import { User } from "../schemas/User";

@injectable()
export class GetAllUsersService {
  public async execute() {
    return User.find();
  }
}