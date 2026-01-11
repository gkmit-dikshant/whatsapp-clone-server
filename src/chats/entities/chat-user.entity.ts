import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chat } from './chat.entity';

@Entity('chat_users')
export class ChatUser {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'chat_id', type: 'int' })
  chatId: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;

  @ManyToOne(() => User, (user) => user.chatUsers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.chatUsers)
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
