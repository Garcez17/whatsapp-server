import { server } from './http';
import './websocket/ChatService';

server.listen(3333, () => console.log('Server Started on Port 3000.'));
