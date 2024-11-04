import { injectable } from "tsyringe";
import { ChatRoom } from "../schemas/ChatRoom";
import { User } from "../schemas/User";

@injectable()
export class BanUserFromChatService {
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
      .populate('idUsers')
      .populate('idBanned');


    if (!room) 
        throw new Error('Chat room not found');
    

    // Verifying if the requester is the admin
    if (String(room.idAdmin._id) !== String(adminId)) 
      throw new Error('Only admin can ban users');
    
    // Checking out if user is already banned
    const isUserBanned = room.idBanned.some(
      bannedUser => String(bannedUser._id) === String(userId)
    );

    if (isUserBanned) 
      throw new Error('User is already banned from this room');

    // Removing user from room members and adding to banned list
    await ChatRoom.findOneAndUpdate(
      { idChatRoom: roomId },
      {
        $pull: { idUsers: userId },
        $push: { idBanned: userId }
      }
    );

    const updatedRoom = await ChatRoom.findOne({ idChatRoom: roomId })
      .populate('idAdmin')
      .populate('idUsers')
      .populate('idBanned');

    return updatedRoom;
  }
}