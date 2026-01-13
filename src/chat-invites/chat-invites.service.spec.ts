import { Test, TestingModule } from '@nestjs/testing';
import { ChatInvitesService } from './chat-invites.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatInvite } from './entities/chat-invites.entity';
import { User } from 'src/users/entities/user.entity';
import { ChatUser } from 'src/chats/entities/chat-user.entity';
import { MailerService } from '@nestjs-modules/mailer';

const mockedChatInviteRepo = {};
const mockedUserRepo = {};
const mockedChatUserRepo = {};
const mockedMailService = {};

describe('ChatInvitesService', () => {
  let service: ChatInvitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatInvitesService,
        {
          provide: getRepositoryToken(ChatInvite),
          useValue: mockedChatInviteRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockedUserRepo,
        },
        {
          provide: getRepositoryToken(ChatUser),
          useValue: mockedChatUserRepo,
        },
        {
          provide: MailerService,
          useValue: mockedMailService,
        },
      ],
    }).compile();

    service = module.get<ChatInvitesService>(ChatInvitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
