import { injectable } from "tsyringe";
import { ChatRoom } from "../schemas/ChatRoom";

@injectable()
export class UnbanUserFromChatService {
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
      .populate('idBanned');

    if (!room) 
      throw new Error('Chat room not found');
    

    // Verify if the requester is the admin
    if (String(room.idAdmin._id) !== String(adminId)) 
      throw new Error('Only admin can unban users');
    

    // Remove user from banned list
    await ChatRoom.findOneAndUpdate(
      { idChatRoom: roomId },
      {
        $pull: { idBanned: userId }
      }
    );

    const updatedRoom = await ChatRoom.findOne({ idChatRoom: roomId })
      .populate('idAdmin')
      .populate('idUsers')
      .populate('idBanned');

    return updatedRoom;
  }
}