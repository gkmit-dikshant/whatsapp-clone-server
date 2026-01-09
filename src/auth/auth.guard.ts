import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    console.log(token);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: { id: string } = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
      });

      const user = await this.userService.findById(+payload.id);

      if (!user) {
        throw new UnauthorizedException();
      }

      request['user'] = { ...payload, email: user.email };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
