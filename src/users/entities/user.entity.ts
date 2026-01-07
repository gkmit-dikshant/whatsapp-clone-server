import { ChatUser } from 'src/chats/entities/chat-user.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ type: 'varchar', default: 'Hey, there I m using WhatsApp!' })
  about: string;

  @Column({ name: 'pic_url' })
  picUrl: string;

  @OneToMany(() => ChatUser, (chatUser) => chatUser.user)
  chatUsers: ChatUser[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;
}
