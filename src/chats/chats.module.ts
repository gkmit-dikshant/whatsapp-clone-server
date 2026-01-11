import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatUser } from './entities/chat-user.entity';
import { User } from 'src/users/entities/user.entity';
import { Chat } from './entities/chat.entity';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, ChatUser, User]), MessagesModule],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
