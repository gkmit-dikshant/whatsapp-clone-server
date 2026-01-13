import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { MessagesService } from 'src/messages/messages.service';
import { CreateChatDto } from './dto/create-chat-dto';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { AccessGuard } from 'src/auth/role.guard';

const mockChatsService = {
  create: jest.fn(),
  findUserChats: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  updateAdminStatus: jest.fn(),
  removeMember: jest.fn(),
};

const mockMessagesService = {
  create: jest.fn(),
  getAllMessageOfChat: jest.fn(),
};

describe('ChatsController', () => {
  let controller: ChatsController;
  let chatService: jest.Mocked<ChatsService>;
  let messageService: jest.Mocked<MessagesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatsController],
      providers: [
        {
          provide: ChatsService,
          useValue: mockChatsService,
        },
        {
          provide: MessagesService,
          useValue: mockMessagesService,
        },
      ],
    })
      .overrideGuard(AccessGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<ChatsController>(ChatsController);
    chatService = module.get(ChatsService);
    messageService = module.get(MessagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(chatService).toBeDefined();
    expect(messageService).toBeDefined();
  });

  describe('create', () => {
    it('should create a chat', async () => {
      const req = { user: { id: 1 } };
      const dto: CreateChatDto = {
        name: 'Test Chat',
        isGroup: true,
        members: [1],
      };

      const newChat = {
        id: 1,
        name: 'comedy circle 2',
        about: null,
        picUrl: null,
        isGroup: true,
        createdAt: '2026-01-12T17:24:55.464Z',
        updatedAt: '2026-01-12T17:24:55.464Z',
      };

      chatService.create.mockResolvedValue(newChat);

      const result = await controller.create(req, dto);

      expect(chatService.create).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(newChat);
    });
  });

  describe('getAllUsersChats', () => {
    it('should return user chats with pagination', async () => {
      const req = { user: { id: 1 } };
      const query = { page: '1', limit: '10' };

      chatService.findUserChats.mockResolvedValue([]);

      const result = await controller.getAllUsersChats(req, query);

      expect(chatService.findUserChats).toHaveBeenCalledWith(1, 1, 10);
      expect(result).toEqual([]);
    });
  });

  describe('sendMessage', () => {
    it('should send a message with files', async () => {
      const req = { user: { id: 1 } };
      const dto: CreateMessageDto = { content: 'Hello' } as CreateMessageDto;
      const files = {
        file: [{ originalname: 'test.png' }] as Express.Multer.File[],
      };

      messageService.create.mockResolvedValue({ id: 1 });

      const result = await controller.sendMessage(req, 2, dto, files);

      expect(messageService.create).toHaveBeenCalledWith(1, 2, dto, files.file);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('getById', () => {
    it('should return chat by id', async () => {
      const chatDetails = {
        id: 1,
        name: 'test chat',
        about: null,
        picUrl: null,
        isGroup: true,
        members: [
          {
            id: 2,
            name: 'test user',
            email: 'tes@email.co',
            about: 'updated about',
            picUrl: 'pic_url',
            createdAt: '2026-01-11T16:56:41.714Z',
            updatedAt: '2026-01-13T03:24:07.895Z',
            isAdmin: true,
          },
        ],
      };
      chatService.findById.mockResolvedValue(chatDetails);

      const result = await controller.getById(1);

      expect(chatService.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(chatDetails);
    });
  });

  describe('update', () => {
    it('should update chat and return success message', async () => {
      const dto = { name: 'Updated Chat' };
      const file = { originalname: 'chat.png' } as Express.Multer.File;

      chatService.update.mockResolvedValue(undefined);

      const result = await controller.update(1, dto, file);

      expect(chatService.update).toHaveBeenCalledWith(1, dto, file);
      expect(result).toEqual({ message: 'updated successfully' });
    });
  });

  describe('getAllMessage', () => {
    it('should return messages of chat', async () => {
      const req = { user: { id: 1 } };
      const query = { page: '1', limit: '10' };

      messageService.getAllMessageOfChat.mockResolvedValue([]);

      const result = await controller.getAllMessage(req, 2, query);

      expect(messageService.getAllMessageOfChat).toHaveBeenCalledWith(
        1,
        2,
        '1',
        '10',
      );
      expect(result).toEqual([]);
    });
  });

  describe('updateAdmin', () => {
    it('should update admin status', async () => {
      const req = { user: { id: 1 } };
      const dto = { userId: 2, isAdmin: true };

      chatService.updateAdminStatus.mockResolvedValue(undefined);

      const result = await controller.updateAdmin(req as any, 10, dto);

      expect(chatService.updateAdminStatus).toHaveBeenCalledWith(10, 2, true);
      expect(result).toEqual({ message: 'admin status updated' });
    });

    it('should throw ForbiddenException if user updates themselves', async () => {
      const req = { user: { id: 1 } };
      const dto = { userId: 1, isAdmin: true };

      await expect(controller.updateAdmin(req as any, 10, dto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('removeMember', () => {
    it('should remove a member from chat', async () => {
      const req = { user: { id: 1 } };

      chatService.removeMember.mockResolvedValue(undefined);

      const result = await controller.removeMember(req as any, 10, 2);

      expect(chatService.removeMember).toHaveBeenCalledWith(10, 2);
      expect(result).toBeNull();
    });

    it('should throw ForbiddenException if user removes themselves', async () => {
      const req = { user: { id: 1 } };

      await expect(controller.removeMember(req as any, 10, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
