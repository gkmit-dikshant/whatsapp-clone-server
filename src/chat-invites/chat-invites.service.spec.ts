import { Test, TestingModule } from '@nestjs/testing';
import { ChatInvitesService } from './chat-invites.service';

describe('ChatInvitesService', () => {
  let service: ChatInvitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatInvitesService],
    }).compile();

    service = module.get<ChatInvitesService>(ChatInvitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
