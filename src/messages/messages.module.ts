import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { ChatUser } from 'src/chats/entities/chat-user.entity';
import { MediaService } from 'src/media/media.service';
import { MessageMedia } from 'src/media/entities/message-media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, ChatUser, MessageMedia])],
  controllers: [MessagesController],
  providers: [MessagesService, MediaService],
  exports: [MessagesService],
})
export class MessagesModule {}
