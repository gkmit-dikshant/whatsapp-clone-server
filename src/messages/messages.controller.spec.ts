import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

describe('MessagesController', () => {
  let controller: MessagesController;
  let service: jest.Mocked<MessagesService>;

  const mockedMessageService = {
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        {
          provide: MessagesService,
          useValue: mockedMessageService,
        },
      ],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
    service = module.get(MessagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('update', () => {
    it('should call MessagesService.update with correct params', async () => {
      const req = { user: { id: 1 } };
      const messageId = 10;
      const dto: CreateMessageDto = { content: 'updated message' };

      service.update.mockResolvedValue(undefined);

      const result = await controller.update(req as any, messageId, dto);

      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(1, messageId, dto.content);

      expect(result).toEqual({
        message: 'update successfully',
      });
    });
  });

  describe('delete', () => {
    it('should call MessagesService.delete with correct params and return null', async () => {
      const req = { user: { id: 1 } };
      const messageId = 20;

      service.delete.mockResolvedValue(undefined);

      const result = await controller.delete(req as any, messageId);

      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith(1, messageId);
      expect(result).toBeNull();
    });
  });
});
