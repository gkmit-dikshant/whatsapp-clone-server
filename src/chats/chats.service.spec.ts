import { Test, TestingModule } from '@nestjs/testing';
import { ChatsService } from './chats.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatUser } from './entities/chat-user.entity';
import { Chat } from './entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import { ChatInvitesService } from 'src/chat-invites/chat-invites.service';
import { MediaService } from 'src/media/media.service';

const mockedChatUserRepo = {};

const mockedChatRepo = {};

const mockedUserRepo = {};

const mockedChatInvitesService = {};

const mockedMediaService = {};

describe('ChatsService', () => {
  let service: ChatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        {
          provide: getRepositoryToken(ChatUser),
          useValue: mockedChatUserRepo,
        },
        {
          provide: getRepositoryToken(Chat),
          useValue: mockedChatRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockedUserRepo,
        },
        {
          provide: ChatInvitesService,
          useValue: mockedChatInvitesService,
        },
        {
          provide: MediaService,
          useValue: mockedMediaService,
        },
      ],
    }).compile();

    service = module.get<ChatsService>(ChatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
