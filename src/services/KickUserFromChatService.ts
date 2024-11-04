import { injectable } from "tsyringe";
import { ChatRoom } from "../schemas/ChatRoom";

@injectable()
export class KickUserFromChatService {
  public async execute({ 
    roomId, 
    userId, 
    adminId 
  }: { 
    roomId: string; 
    userId: string; 
    adminId: string;
  }) {
    const room = await ChatRoom.findOne({ idChatRoom: roomId })
      .populate('idAdmin')
      .populate('idUsers');

    if (!room)
      throw new Error('Chat room not found');

    // Verifying whether the requester is the admin or not
    if (String(room.idAdmin._id) !== String(adminId)) 
      throw new Error('Only admin can kick users');

    // Removing user from room
    await ChatRoom.findOneAndUpdate(
      { idChatRoom: roomId },
      {
        $pull: { idUsers: userId }
      }
    );

    const updatedRoom = await ChatRoom.findOne({ idChatRoom: roomId })
      .populate('idAdmin')
      .populate('idUsers');

    return updatedRoom;
  }
}