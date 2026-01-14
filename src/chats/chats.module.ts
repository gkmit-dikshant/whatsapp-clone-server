import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatUser } from './entities/chat-user.entity';
import { User } from 'src/users/entities/user.entity';
import { Chat } from './entities/chat.entity';
import { MessagesModule } from 'src/messages/messages.module';
import { MediaService } from 'src/media/media.service';
import { ChatInvitesService } from 'src/chat-invites/chat-invites.service';
import { ChatInvite } from 'src/chat-invites/entities/chat-invites.entity';
import { Message } from 'src/messages/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, ChatUser, User, ChatInvite, Message]),
    MessagesModule,
  ],
  controllers: [ChatsController],
  providers: [ChatsService, MediaService, ChatInvitesService],
})
export class ChatsModule {}
