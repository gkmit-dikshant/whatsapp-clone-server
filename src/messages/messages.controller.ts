import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AccessGuard } from 'src/auth/role.guard';
import { Access } from 'src/auth/decorators/access.decorators';
import { ChatAccessLevel } from 'src/enum/chat-access.enum';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

@Controller('messages')
export class MessagesController {
  constructor(private messageService: MessagesService) {}

  @UseGuards(AccessGuard)
  @Access({ chat: ChatAccessLevel.MEMBER })
  @Post(':chatId')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file' }]))
  create(
    @Req() req,
    @Param('chatId', ParseIntPipe) chatId: number,
    @Body() dto: CreateMessageDto,
    @UploadedFiles()
    files: {
      file?: Express.Multer.File[];
    },
  ) {
    return this.messageService.create(req.user.id, chatId, dto, files.file);
  }

  @Patch(':id')
  async update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateMessageDto,
  ) {
    await this.messageService.update(req.user.id, id, dto.content);
    return {
      message: 'update successfully',
    };
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Req() req, @Param('id', ParseIntPipe) id: number) {
    await this.messageService.delete(req.user.id, id);
    return null;
  }
}
