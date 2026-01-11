import { SetMetadata } from '@nestjs/common';
import { ChatAccessLevel } from 'src/enum/chat-access.enum';

export const ACCESS_KEY = 'chat_access';

export interface AccessRules {
  chat?: ChatAccessLevel;
}

export const Access = (rules: AccessRules) => SetMetadata(ACCESS_KEY, rules);
