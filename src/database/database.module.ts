import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { ChatUser } from 'src/chats/entities/chat-user.entity';
import { Message } from 'src/messages/entities/message.entity';
import { MessageMedia } from 'src/message-media/entities/message-media-entity';
import { ChatInvite } from 'src/chat-invites/entities/chat-invites-entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.getOrThrow<string>('DB_HOST'),
        port: configService.getOrThrow<number>('DB_PORT'),
        username: configService.getOrThrow<string>('DB_USERNAME'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_NAME'),
        entities: [User, Chat, ChatUser, Message, MessageMedia, ChatInvite],
        synchronize: configService.getOrThrow<string>('DB_SYNC') === 'true',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
