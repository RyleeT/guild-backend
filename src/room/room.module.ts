import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Room } from 'lib/entities';
import { RoomService } from './room.service';
import { UserModule } from 'user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), UserModule],
  exports: [RoomService],
  providers: [RoomService],
})
export class RoomModule {}
