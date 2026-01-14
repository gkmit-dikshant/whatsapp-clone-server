import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('')
  getAll(@Query() q) {
    const { name, email, page, limit, sort, order } = q;
    return this.userService.findAll(email, name, +page, +limit, sort, +order);
  }

  @Get('/me')
  getMe(@Request() req) {
    return this.userService.findById(+req.user.id);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  @Patch('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    await this.userService.update(id, dto);
    return {
      message: 'updated successfully',
    };
  }
}
