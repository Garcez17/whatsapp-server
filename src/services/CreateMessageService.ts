import { injectable } from "tsyringe";
import { Message } from "../schemas/Message";

type IRequest = {
  to: string;
  text: string;
  roomId: string;
}

@injectable()
export class CreateMessageService {
  public async execute(data: IRequest) {
    return Message.create(data);
  }
}
