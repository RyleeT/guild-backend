import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Room } from 'lib/entities';
import { UserService } from 'user/user.service';

@Injectable()
export class RoomService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
  ) {}

  async getById(roomId: string) {
    return this.roomRepo.findOne({
      relations: ['users'],
      where: { id: roomId },
    });
  }

  // TODO: Fewer transactions
  async getOrCreate(senderId: string, recipientId: string) {
    // Check if room already exists
    const room = await this.roomRepo
      .createQueryBuilder('room')
      .innerJoin('room.users', 'sender', 'sender.id = :senderId', { senderId })
      .innerJoinAndSelect(
        'room.users',
        'recipient',
        'recipient.id = :recipientId',
        {
          recipientId,
        },
      )
      .leftJoinAndSelect('room.messages', 'message')
      .getOne();

    if (room) return room;

    // Room doesn't exist, so create it
    const [sender, recipient] = await Promise.all([
      this.userService.getById(senderId),
      this.userService.getById(recipientId),
    ]);
    const newRoom = await this.roomRepo.save({ users: [sender, recipient] });
    newRoom.messages = [];

    return newRoom;
  }
}
