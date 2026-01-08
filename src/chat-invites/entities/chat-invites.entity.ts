import { Chat } from 'src/chats/entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('chat_invites')
export class ChatInvite {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'chat_id', type: 'int' })
  chatId: number;

  @Column({ name: 'to_user_id', type: 'int' })
  toUserId: number;

  @Column({ name: 'from_user_id', type: 'int' })
  fromUserId: number;

  @Column({ type: 'int' })
  expiry: number;

  @ManyToOne(() => Chat, (chat) => chat.chatInvites)
  chat: Chat;

  @ManyToOne(() => User, (user) => user.receivedInvites)
  toUser: User;

  @ManyToOne(() => User, (user) => user.sentInvites)
  fromUser: User;

  @Column({ name: 'is_accepted', type: 'boolean', default: false })
  isAccepted: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
