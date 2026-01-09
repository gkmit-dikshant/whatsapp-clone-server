import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from '@nestjs/cache-manager';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private jwtService: JwtService,
    private mailService: MailerService,
    private configService: ConfigService,
  ) {}

  async register(data: createUserDto) {
    // create user

    const existing = await this.userService.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('account already exists');
    }
    const u = await this.userService.create(data);

    // generate otp
    const otp = await this.generateOtp(u.email);

    // send otp
    this.mailService
      .sendMail({
        to: u.email,
        from: this.configService.getOrThrow<string>('OTP_SENDER_EMAIL'),
        text: otp,
        subject: 'register otp',
      })
      .then(() => console.log('otp sent'))
      .catch(() => console.log('failed to send email'));

    return {
      message: 'otp sent successfully',
    };
  }

  async login(email: string) {
    // find user
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const otp = await this.generateOtp(user.email);
    // send otp
    this.mailService
      .sendMail({
        to: user.email,
        from: this.configService.getOrThrow<string>('OTP_SENDER_EMAIL'),
        text: otp,
        subject: 'login otp',
      })
      .then(() => console.log('otp sent'))
      .catch(() => console.log('failed to send email'));
    return {
      message: 'otp sent successfully',
    };
  }

  async verifyOtp(email: string, otp: string) {
    const cachedOtp = await this.cacheService.get(email);
    if (cachedOtp !== otp) {
      throw new UnauthorizedException('invalid otp');
    }

    const u = await this.userService.findByEmail(email, false);
    if (!u) {
      throw new UnauthorizedException();
    }
    if (!u.isVerified) {
      // update user isVerified
      await this.userService.update(u.id, {
        isVerified: true,
      } as UpdateUserDto);
    }
    // create token
    const { accessToken, refreshToken } = await this.createToken(
      u.id.toString(),
    );
    // send token
    return {
      accessToken,
      refreshToken,
    };
  }

  async generateOtp(key: string) {
    // generate otp
    const exp = this.configService.getOrThrow<number>('OTP_EXP');
    const otp = Math.round(Math.random() * 10000);
    await this.cacheService.set(key, otp.toString(), exp);
    return otp.toString();
  }

  async createToken(userId: string) {
    const payload = { sub: userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.getOrThrow<number>('ACCESS_TOKEN_EXP'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.getOrThrow<number>('REFRESH_TOKEN_EXP'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
