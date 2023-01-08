import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

import { Message, Room, RootEntity } from '.';

@Entity({ name: 'user' })
export default class User extends RootEntity {
  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  socketId: string;

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @ManyToMany(() => Room, (room) => room.users)
  rooms: Room[];
}
