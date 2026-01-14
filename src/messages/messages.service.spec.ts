import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessageMedia } from 'src/media/entities/message-media.entity';
import { MediaService } from 'src/media/media.service';

const mockedMessageRepo = {};
const mockedMessageMediaRepo = {};
const mockedMediaService = {};

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getRepositoryToken(Message),
          useValue: mockedMessageRepo,
        },
        {
          provide: getRepositoryToken(MessageMedia),
          useValue: mockedMessageMediaRepo,
        },
        {
          provide: MediaService,
          useValue: mockedMediaService,
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
