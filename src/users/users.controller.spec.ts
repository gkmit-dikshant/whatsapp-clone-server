import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should call usersService.findAll with query params', async () => {
      const query = {
        name: 'John',
        email: 'john@test.com',
        page: '1',
        limit: '10',
        sort: 'name',
        order: '1',
      };

      mockUsersService.findAll.mockResolvedValue([]);

      const result = await controller.getAll(query);

      expect(service.findAll).toHaveBeenCalledWith(
        query.email,
        query.name,
        1,
        10,
        query.sort,
        1,
      );
      expect(result).toEqual([]);
    });
  });

  describe('getMe', () => {
    it('should return the current user by id from request', async () => {
      const req = {
        user: { id: 5 },
      };

      const user = {
        id: 5,
        name: 'Dikshant Gkmit',
        email: 'dikshant@gkmit.co',
        about: 'updated about',
        picUrl: 'https://avatar.png',
        createdAt: '2026-01-11T16:56:41.714Z',
        updatedAt: '2026-01-12T15:00:28.160Z',
      };
      mockUsersService.findById.mockResolvedValue(user);

      const result = await controller.getMe(req as any);

      expect(service.findById).toHaveBeenCalledWith(5);
      expect(result).toEqual(user);
    });
  });

  describe('getById', () => {
    it('should return user by id', async () => {
      const user = {
        id: 1,
        name: 'Dikshant Sharma',
        email: 'dikshantsharma2005@gmail.com',
        about: 'Hey, there I m using WhatsApp!',
        picUrl: null,
        createdAt: '2026-01-11T16:36:54.442Z',
        updatedAt: '2026-01-12T08:05:49.023Z',
      };
      mockUsersService.findById.mockResolvedValue(user);

      const result = await controller.getById(1);

      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update user and return success message', async () => {
      const dto: UpdateUserDto = {
        name: 'Updated Name',
        picUrl: 'https://pic.com',
      } as UpdateUserDto;

      mockUsersService.update.mockResolvedValue(undefined);

      const result = await controller.update(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({
        message: 'updated successfully',
      });
    });

    it('should update user even if no file is provided', async () => {
      const dto: UpdateUserDto = {
        name: 'Updated Name',
      } as UpdateUserDto;

      mockUsersService.update.mockResolvedValue(undefined);

      const result = await controller.update(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result.message).toBe('updated successfully');
    });
  });
});
