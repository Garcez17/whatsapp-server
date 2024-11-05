import { injectable } from "tsyringe";
import { ChatRoom } from "../schemas/ChatRoom";
import { User } from "../schemas/User";

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
      .populate('idUsers')
      .sort({ idUsersJoinedAt: 1 }); // Sorting users by join date;

    if (!room)
      throw new Error('Chat room not found');

    // Verifying whether the requester is the admin or not
    if (String(room.idAdmin._id) !== String(adminId)) 
      throw new Error('Only admin can kick users');


    // Check if the user to be kicked is the adm
    if (String(room.idAdmin._id) === String(userId)) {
      // Find the oldest user in the room (not including the adm)
      const newAdmin = room.idUsers.find(
        (user) => String(user._id) !== String(userId)
      );

      if (newAdmin) {
        // Update the new adm in the room
        await ChatRoom.findOneAndUpdate(
          { idChatRoom: roomId },
          {
            idAdmin: newAdmin._id
          },
          { new: true }
        );
      } else {
        // Adm is the only in the chat room, cannot kick
        throw new Error('Cannot kick the only user in the room');
      }
    }

    // Removing user from the room
    await ChatRoom.findOneAndUpdate(
      { idChatRoom: roomId },
      {
        $pull: { idUsers: userId }
      },
      { new: true }
    );
  
    const updatedRoom = await ChatRoom.findOne({ idChatRoom: roomId }).populate('idUsers')

    return updatedRoom;
  }
}