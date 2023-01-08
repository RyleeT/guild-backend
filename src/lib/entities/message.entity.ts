import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

import { Room, RootEntity, User } from '.';

@Entity({ name: 'message' })
export default class Message extends RootEntity {
  @Column()
  body: string;

  @ManyToOne(() => Room, (room) => room.messages)
  room: Room;

  @Column()
  @RelationId((message: Message) => message.room)
  roomId: string;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;

  @Column()
  @RelationId((message: Message) => message.sender)
  senderId: string;
}
