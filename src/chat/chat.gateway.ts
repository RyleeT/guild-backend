import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MessageService } from 'message/message.service';
import { RoomService } from 'room/room.service';
import { UserService } from 'user/user.service';

@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class ChatGateway implements OnGatewayDisconnect {
  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomService,
    private readonly userService: UserService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() data: { body: string; roomId: string; senderId: string },
  ) {
    const newMessage = await this.messageService.create(data);
    const room = await this.roomService.getById(data.roomId);

    room.users.forEach(({ socketId }) => {
      if (socketId) {
        this.server.to(socketId).emit('message', newMessage);
        console.info('Emitting message to: ', socketId);
      }
    });
  }

  @SubscribeMessage('createRoom')
  async createRoom(
    @MessageBody() data: { senderId: string; recipientId: string },
  ) {
    const { senderId, recipientId } = data;

    const room = await this.roomService.getOrCreate(senderId, recipientId);

    return room;
  }

  @SubscribeMessage('connectToUser')
  async connectToUser(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId } = data;

    const user = await this.userService.updateSocketId(userId, client.id);

    if (user) {
      client.broadcast.emit('user', user);
      console.info('User connected: ', user.username, client.id);
    }
  }

  async handleDisconnect(client: Socket) {
    const user = await this.userService.removeSocketId(client.id);

    if (user) {
      client.broadcast.emit('user', user);
      console.info('User disconnected: ', user.username, client.id);
    }
  }
}
