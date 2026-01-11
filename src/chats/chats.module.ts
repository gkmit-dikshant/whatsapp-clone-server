import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatUser } from './entities/chat-user.entity';
import { User } from 'src/users/entities/user.entity';
import { Chat } from './entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, ChatUser, User])],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
