import { Test, TestingModule } from '@nestjs/testing';
import { MessageMediaController } from './media.controller';

describe('MessageMediaController', () => {
  let controller: MessageMediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageMediaController],
    }).compile();

    controller = module.get<MessageMediaController>(MessageMediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
