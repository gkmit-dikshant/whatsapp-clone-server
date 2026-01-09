import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login-dto';
import { VerifyDto } from './dto/verify-dto';
import { Public } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/register')
  @HttpCode(200)
  register(@Body() dto: createUserDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('/login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    const { email } = dto;
    return this.authService.login(email);
  }

  @Public()
  @Post('/verify-otp')
  @HttpCode(200)
  verifyOtp(@Body() dto: VerifyDto) {
    const { email, otp } = dto;
    return this.authService.verifyOtp(email, otp);
  }
}
