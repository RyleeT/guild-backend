import { Body, Controller, Get, Param, Put } from '@nestjs/common';

import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // TODO: We should get the current user from an auth token instead of a param
  @Get('users/:name')
  async getUsers(@Param('name') name: string) {
    return await this.userService.getAllButOne(name);
  }

  @Put('user')
  async signIn(@Body('name') name: string) {
    return this.userService.getOrCreate(name);
  }
}
