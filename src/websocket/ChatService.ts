import { container } from "tsyringe";

import { io } from "../http";

import { CreateUserService } from "../services/CreateUserService";
import { GetUserByIdService } from "../services/GetUserByIdService";
import { GetAllUsersService } from "../services/GetAllUsersService";
import { CreateMessageService } from "../services/CreateMessageService";
import { CreateChatRoomService } from "../services/CreateChatRoomService";
import { GetChatRoomByIdService } from "../services/GetChatRoomByIdService";
import { ToogleUserOnlineService } from "../services/ToogleUserOnlineService";
import { GetUserBySocketIdService } from "../services/GetUserBySocketIdService";
import { GetChatRoomByUsersService } from "../services/GetChatRoomByUsersService";
import { GetMessagesByChatRoomService } from "../services/GetMessagesByChatRoomService";
import { GetUnreadMessagesFromChat } from "../services/GetUnreadMessagesFromChat";
import { UpdateReadMessageService } from "../services/UpdateReadMessageService";
import { GetUserByMongoIdService } from "../services/getUserByMongoIdService";

io.on('connect', socket => {
  socket.on('online', async (email, callback) => {
    const toogleUserOnlineService = container.resolve(ToogleUserOnlineService);

    const data = {
      email,
      socket_id: socket.id,
      is_online: true,
    }

    const updatedUser = await toogleUserOnlineService.execute(data);

    callback(updatedUser);

    socket.broadcast.emit('update_connection', updatedUser);
  });

  socket.on('disconnect', async () => {
    const getUserBySocketIdService = container.resolve(GetUserBySocketIdService);
    const toogleUserOnlineService = container.resolve(ToogleUserOnlineService);

    const user = await getUserBySocketIdService.execute(socket.id);

    if (!user) return;

    const dataUsr = {
      email: user!.email,
      socket_id: socket.id,
      is_online: false,
    }

    const updatedUser = await toogleUserOnlineService.execute(dataUsr);

    socket.broadcast.emit('update_connection', updatedUser);
  });

  socket.on("start", async data => {
    const { email, avatar, name } = data;

    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      email,
      avatar,
      name,
      socket_id: socket.id,
    });

    socket.broadcast.emit('new_users', user);
  });

  socket.on('get_users', async (data, callback) => {
    const getAllUsersService = container.resolve(GetAllUsersService);

    const contacts = await getAllUsersService.execute({ user_id: data });

    callback(contacts);
  });

  socket.on('verify_connection', async (data, callback) => {
    const getUserByIdService = container.resolve(GetUserByIdService);

    const user = await getUserByIdService.execute(data.id);

    callback(user?.is_online || false);
  });

  socket.on('start_chat', async (data, callback) => {
    const createChatRoomService = container.resolve(CreateChatRoomService);
    const getChatRoomByUsersService = container.resolve(GetChatRoomByUsersService);
    const getUserBySocketIdService = container.resolve(GetUserBySocketIdService);
    const getMessagesByChatRoomService = container.resolve(GetMessagesByChatRoomService);
    const updateReadMessageService = container.resolve(UpdateReadMessageService);
    const getUserByMongoIdService = container.resolve(GetUserByMongoIdService);

    const userLogged = await getUserBySocketIdService.execute(socket.id);

    let room = await getChatRoomByUsersService.execute([data.idUser, userLogged!._id]);

    if (!room) {
      room = await createChatRoomService.execute([data.idUser, userLogged!._id]);
    }

    socket.join(room.idChatRoom);

    const messages = await getMessagesByChatRoomService.execute(room.idChatRoom);

    if (messages.some(msg => msg.read === false)) {
      const updatedMessages = await updateReadMessageService.execute({
        messages,
        user_logged_id: userLogged!._id,
      })

      const userFrom = await getUserByMongoIdService.execute(data.idUser);

      io.to(userFrom!.socket_id).emit('updated_messages', {
        updatedMessages,
      })
    }

    callback({ roomId: room.idChatRoom, messages });
  });

  socket.on('message', async (data) => {
    const getUnreadMessagesFromChat = container.resolve(GetUnreadMessagesFromChat);
    const createMessageService = container.resolve(CreateMessageService);
    const getChatRoomByIdService = container.resolve(GetChatRoomByIdService);
    const getUserByIdService = container.resolve(GetUserByIdService);

    const userLogged = await getUserByIdService.execute(data.user_id);

    const message = await createMessageService.execute({
      text: data.message,
      roomId: data.roomId,
      to: userLogged!._id,
    });

    io.to(data.roomId).emit('message', {
      message,
      userLogged,
    });

    const room = await getChatRoomByIdService.execute(data.roomId);

    const userFrom = room!.idUsers.find(user => String(user._id) !== String(userLogged!._id));

    const { lastMessage, unreadMessages } = await getUnreadMessagesFromChat.execute({
      roomId: data.roomId,
      user_id: userLogged?._id,
    });

    io.to(userFrom!.socket_id).emit('notification', {
      lastMessage,
      room,
      from: userLogged,
      unreadMessages,
    })
  });
});
