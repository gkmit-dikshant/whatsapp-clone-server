import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ChatUser } from 'src/chats/entities/chat-user.entity';
import { ACCESS_KEY, AccessRules } from './decorators/access.decorators';
import { ChatAccessLevel } from 'src/enum/chat-access.enum';
import { AuthRequest } from 'src/types/auth-request';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(ChatUser)
    private readonly chatUserRepo: Repository<ChatUser>,
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
        throw new ForbiddenException('Chat ID missing');
      }

      const chatUser = await this.chatUserRepo.findOne({
        where: {
          chatId,
          userId: user.id,
          deletedAt: IsNull(),
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
