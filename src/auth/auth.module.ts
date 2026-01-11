import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessGuard } from './role.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatUser } from 'src/chats/entities/chat-user.entity';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([ChatUser]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessGuard],
  exports: [AccessGuard],
})
export class AuthModule {}
