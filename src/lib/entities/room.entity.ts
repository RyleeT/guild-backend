import { Entity, JoinColumn, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { Message, RootEntity, User } from '.';

@Entity({ name: 'room' })
export default class Room extends RootEntity {
  @OneToMany(() => Message, (message) => message.room)
  @JoinColumn()
  messages: Message[];

  @ManyToMany(() => User, (user) => user.rooms)
  @JoinTable()
  users: User[];
}
