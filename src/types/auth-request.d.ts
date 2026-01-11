import { Request } from 'express';
import { ChatUser } from 'src/chats/entities/chat-user.entity';

export interface AuthRequest extends Request {
  user: { id: number };
  chatUser?: ChatUser;
}
