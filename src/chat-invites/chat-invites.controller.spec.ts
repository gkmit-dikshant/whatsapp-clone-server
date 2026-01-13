import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ChatInvitesController } from './chat-invites.controller';
import { ChatInvitesService } from './chat-invites.service';
import { AccessGuard } from 'src/auth/role.guard';
import { CreateChatInviteDto } from './dto/create-chat-invite.dto';

describe('ChatInvitesController', () => {
  let controller: ChatInvitesController;
  let service: jest.Mocked<ChatInvitesService>;

  const mockedChatInviteService = {
    create: jest.fn(),
    updateStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatInvitesController],
      providers: [
        {
          provide: ChatInvitesService,
          useValue: mockedChatInviteService,
        },
      ],
    })
      .overrideGuard(AccessGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<ChatInvitesController>(ChatInvitesController);
    service = module.get(ChatInvitesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create chat invite and return token', async () => {
      const req = { user: { id: 1 } };
      const chatId = 10;
      const dto: CreateChatInviteDto = {
        email: 'test@example.com',
      };

      service.create.mockResolvedValue({
        token: 'invite-token-123',
      } as any);

      const result = await controller.create(req as any, chatId, dto);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(req.user.id, chatId, dto);

      expect(result).toEqual({
        message: 'invite sent successfully',
        token: 'invite-token-123',
      });
    });
  });

  describe('updateStatus', () => {
    it('should throw BadRequestException if token is missing', async () => {
      const req = {};

      await expect(
        controller.updateStatus(req as any, undefined as any),
      ).rejects.toThrow(BadRequestException);

      expect(service.updateStatus).not.toHaveBeenCalled();
    });

    it('should accept invite when token is provided', async () => {
      const req = {};
      const token = 'valid-token';

      service.updateStatus.mockResolvedValue(undefined);

      const result = await controller.updateStatus(req as any, token);

      expect(service.updateStatus).toHaveBeenCalledTimes(1);
      expect(service.updateStatus).toHaveBeenCalledWith(token);

      expect(result).toEqual({
        message: 'invite accepted successfully',
      });
    });
  });
});
