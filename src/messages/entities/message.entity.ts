import { Chat } from 'src/chats/entities/chat.entity';
import { MessageMedia } from 'src/message-media/entities/message-media-entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'chat_id', type: 'int' })
  chatId: number;

  @Column({ type: 'text' })
  content: string;

  // message <-- user
  @ManyToOne(() => User, (user) => user.messages)
  user: User;

  // message <-- chat
  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  // message --> message_media
  @OneToMany(() => MessageMedia, (messageMedia) => messageMedia.message)
  messageMedia: MessageMedia[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
