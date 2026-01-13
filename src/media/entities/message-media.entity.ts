import { Message } from 'src/messages/entities/message.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum FILE_TYPE {
  IMG = 'image',
  VIDEO = 'video',
  DOC = 'docs',
}

@Entity('message_media')
export class MessageMedia {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int', name: 'message_id' })
  messageId: number;

  @Column({ type: 'varchar' })
  url: string;

  // message_media <-- message
  @ManyToOne(() => Message, (message) => message.messageMedia)
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @Column({ name: 'media_type', nullable: true })
  mediaType: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;
}
