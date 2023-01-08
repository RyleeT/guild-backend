import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { User } from 'lib/entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getById(userId: string) {
    return await this.userRepo.findOneBy({ id: userId });
  }

  async getAllButOne(name: string) {
    return await this.userRepo.findBy({ username: Not(name) });
  }

  async getOrCreate(name: string) {
    const user = await this.userRepo.findOneBy({ username: name });
    if (user) {
      return user;
    } else {
      return await this.userRepo.save({ username: name });
    }
  }

  async removeSocketId(socketId: string) {
    const user = await this.userRepo.findOneBy({ socketId });
    if (!user) return;
    user.socketId = null;
    return await user.save();
  }

  async updateSocketId(userId: string, socketId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) return;
    user.socketId = socketId;
    return await user.save();
  }
}
