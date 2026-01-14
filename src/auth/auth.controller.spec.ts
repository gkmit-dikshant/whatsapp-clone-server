import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login-dto';
import { VerifyDto } from './dto/verify-dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    verifyOtp: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call authService.register with dto', async () => {
      const dto: createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const response = { message: 'otp sent successfully' };
      mockAuthService.register.mockResolvedValue(response);

      const result = await controller.register(dto);

      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(response);
    });
  });

  describe('login', () => {
    it('should call authService.login with email', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
      };

      const response = { message: 'otp sent successfully' };
      mockAuthService.login.mockResolvedValue(response);

      const result = await controller.login(dto);

      expect(service.login).toHaveBeenCalledWith(dto.email);
      expect(result).toEqual(response);
    });
  });

  describe('verifyOtp', () => {
    it('should call authService.verifyOtp with email and otp', async () => {
      const dto: VerifyDto = {
        email: 'test@example.com',
        otp: '1234',
      };

      const response = {
        accessToken: 'acces-token',
        refreshToken: 'refresh-token',
      };
      mockAuthService.verifyOtp.mockResolvedValue(response);

      const result = await controller.verifyOtp(dto);

      expect(service.verifyOtp).toHaveBeenCalledWith(dto.email, dto.otp);
      expect(result).toEqual(response);
    });
  });
});
