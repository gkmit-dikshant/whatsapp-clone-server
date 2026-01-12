import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('profilePhoto'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @UploadedFile() profilePhoto: Express.Multer.File,
  ) {
    await this.userService.update(id, dto, profilePhoto);
    return {
      message: 'updated successfully',
    };
  }
}
