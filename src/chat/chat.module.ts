import { Module } from '@nestjs/common';

import { ChatGateway } from './chat.gateway';
import { MessageModule } from 'message/message.module';
import { RoomModule } from 'room/room.module';
import { UserModule } from 'user/user.module';

@Module({
  imports: [MessageModule, RoomModule, UserModule],
  exports: [ChatGateway],
  providers: [ChatGateway],
})
export class ChatModule {}
