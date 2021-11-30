import { container } from "tsyringe";
import { io } from "../http";
import { CreateChatRoomService } from "../services/CreateChatRoomService";
import { CreateMessageService } from "../services/CreateMessageService";
import { CreateUserService } from "../services/CreateUserService";
import { GetAllUsersService } from "../services/GetAllUsersService";
import { GetChatRoomByIdService } from "../services/GetChatRoomByIdService";
import { GetChatRoomByUsersService } from "../services/GetChatRoomByUsersService";
import { GetMessagesByChatRoomService } from "../services/GetMessagesByChatRoomService";
import { GetUserByIdService } from "../services/GetUserByIdService";
import { GetUserBySocketIdService } from "../services/GetUserBySocketIdService";
import { ToogleUserOnlineService } from "../services/ToogleUserOnlineService";

io.on('connect', socket => {
  socket.on('online', async (email, callback) => {
    const toogleUserOnlineService = container.resolve(ToogleUserOnlineService);

    const data = {
      email,
      socket_id: socket.id,
      value: true,
    }

    const updatedUser = await toogleUserOnlineService.execute(data);

    callback(updatedUser);

    socket.broadcast.emit('update_connection', updatedUser);
  });

  socket.on('disconnect', async (data) => {
    const getUserBySocketIdService = container.resolve(GetUserBySocketIdService);
    const toogleUserOnlineService = container.resolve(ToogleUserOnlineService);

    const user = await getUserBySocketIdService.execute(socket.id);

    const dataUsr = {
      email: user!.email,
      socket_id: socket.id,
      value: false,
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

  socket.on('get_users', async callback => {
    const getAllUsersService = container.resolve(GetAllUsersService);

    const users = await getAllUsersService.execute();

    callback(users);
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

    const userLogged = await getUserBySocketIdService.execute(socket.id);

    let room = await getChatRoomByUsersService.execute([data.idUser, userLogged!._id]);

    if (!room) {
      room = await createChatRoomService.execute([data.idUser, userLogged!._id]);
    }

    socket.join(room.idChatRoom);

    const messages = await getMessagesByChatRoomService.execute(room.idChatRoom);

    callback({ room, messages });
  });

  socket.on('message', async (data) => {
    const getUserBySocketIdService = container.resolve(GetUserBySocketIdService);
    const createMessageService = container.resolve(CreateMessageService);
    const getChatRoomByIdService = container.resolve(GetChatRoomByIdService);

    const userLogged = await getUserBySocketIdService.execute(socket.id);

    const message = await createMessageService.execute({
      text: data.message,
      roomId: data.idChatRoom,
      to: userLogged!._id,
    });

    io.to(data.idChatRoom).emit('message', {
      message,
      userLogged,
    });

    const room = await getChatRoomByIdService.execute(data.idChatRoom);

    const userFrom = room!.idUsers.find(user => String(user._id) !== String(userLogged!._id));

    io.to(userFrom!.socket_id).emit('notification', {
      newMessage: true,
      roomId: data.idChatRoom,
      from: userLogged,
    })
  });
});
