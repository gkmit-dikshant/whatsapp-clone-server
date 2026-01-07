import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatUser } from './chat-user.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  about: string;

  @Column({ name: 'pic_url', nullable: true })
  picUrl: string;

  @Column({ name: 'is_group', nullable: false, default: false })
  isGroup: boolean;

  @OneToMany(() => ChatUser, (chatUser) => chatUser.chat)
  chatUsers: ChatUser[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
