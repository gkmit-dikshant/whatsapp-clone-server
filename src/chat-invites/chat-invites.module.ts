import { Module } from '@nestjs/common';
import { ChatInvitesController } from './chat-invites.controller';
import { ChatInvitesService } from './chat-invites.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatUser } from 'src/chats/entities/chat-user.entity';
import { ChatInvite } from './entities/chat-invites.entity';
import { User } from 'src/users/entities/user.entity';
import { Chat } from 'src/chats/entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatInvite, ChatUser, User, Chat])],
  controllers: [ChatInvitesController],
  providers: [ChatInvitesService],
})
export class ChatInvitesModule {}
