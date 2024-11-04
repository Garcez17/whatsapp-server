import { injectable } from "tsyringe";
import { ChatRoom } from "../schemas/ChatRoom";
import { User } from "../schemas/User";

@injectable()
export class JoinChatRoomService {
  public async execute({ 
    roomId, 
    userId 
  }: { 
    roomId: string; 
    userId: string;
  }) {
    
    const room = await ChatRoom.findOne({ idChatRoom: roomId })
      .populate('idUsers')
      .populate('idBanned')
      .populate('idAdmin');

    if (!room) 
      throw new Error('Chat room not found');
    

    // Check if user is banned
    const isUserBanned = room.idBanned.some(
      bannedUser => String(bannedUser._id) === String(userId)
    );

    if (isUserBanned) 
      throw new Error('You are banned from this chat room');
    

    // Checking whether the user is already in the room or not
    const isUserInRoom = room.idUsers.some(
      user => String(user._id) === String(userId)
    );

    if (isUserInRoom) 
      throw new Error('You are already in this chat room');
    

    // Checking if room has reached user limit
    if (room.idUsers.length >= room.userLimit) 
      throw new Error('Chat room has reached its user limit');
    

    // Getting current date for joined at timestamp
    const currentDate = new Date();

    // Adding user to room and update timestamps
    const updatedRoom = await ChatRoom.findOneAndUpdate(
      { idChatRoom: roomId },
      {
        $push: { idUsers: userId },
        $set: { [`idUsersJoinedAt.${userId}`]: currentDate }
      },
      { new: true }
    ).populate('idUsers')
     .populate('idAdmin')
     .populate('idBanned');

    return updatedRoom;
  }
}