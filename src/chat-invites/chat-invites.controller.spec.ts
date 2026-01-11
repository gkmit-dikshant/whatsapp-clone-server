import { Test, TestingModule } from '@nestjs/testing';
import { ChatInvitesController } from './chat-invites.controller';

describe('ChatInvitesController', () => {
  let controller: ChatInvitesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatInvitesController],
    }).compile();

    controller = module.get<ChatInvitesController>(ChatInvitesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
