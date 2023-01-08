import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from 'chat/chat.module';
import { MessageModule } from 'message/message.module';
import { RoomModule } from 'room/room.module';
import { UserModule } from 'user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'guild_db',
      entities: [__dirname + '**/**/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    ChatModule,
    MessageModule,
    RoomModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
