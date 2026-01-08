import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { MessageMediaModule } from './message-media/message-media.module';
import { ChatInvitesModule } from './chat-invites/chat-invites.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    DatabaseModule,
    UsersModule,
    ChatsModule,
    MessagesModule,
    MessageMediaModule,
    ChatInvitesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
