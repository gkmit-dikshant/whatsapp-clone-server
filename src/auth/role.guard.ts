import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatUser } from 'src/chats/entities/chat-user.entity';
import { ACCESS_KEY, AccessRules } from './decorators/access.decorators';
import { ChatAccessLevel } from 'src/enum/chat-access.enum';
import { AuthRequest } from 'src/types/auth-request';
import { Chat } from 'src/chats/entities/chat.entity';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(ChatUser)
    private chatUserRepo: Repository<ChatUser>,
    @InjectRepository(Chat) private chatRepo: Repository<Chat>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Unauthenticated');
    }

    const rules =
      this.reflector.get<AccessRules>(ACCESS_KEY, context.getHandler()) ?? {};

    if (rules.chat) {
      const chatId =
        Number(request.params.chatId) || Number(request.body.chatId);

      if (!chatId) {
        throw new BadRequestException('Chat ID missing');
      }

      const chat = await this.chatRepo.findOne({ where: { id: chatId } });
      if (!chat) {
        throw new NotFoundException(`chat with id ${chatId} doesn't exists`);
      }

      const chatUser = await this.chatUserRepo.findOne({
        where: {
          chatId,
          userId: user.id,
        },
      });

      if (!chatUser) {
        throw new ForbiddenException('Not a chat member');
      }

      if (rules.chat === ChatAccessLevel.ADMIN && !chatUser.isAdmin) {
        throw new ForbiddenException('Admin access required');
      }

      request.chatUser = chatUser;
    }

    return true;
  }
}
