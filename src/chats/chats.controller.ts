import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat-dto';
import { AccessGuard } from 'src/auth/role.guard';
import { Access } from 'src/auth/decorators/access.decorators';
import { ChatAccessLevel } from 'src/enum/chat-access.enum';
import { MessagesService } from 'src/messages/messages.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';

@Controller('chats')
export class ChatsController {
  constructor(
    private chatService: ChatsService,
    private messageService: MessagesService,
  ) {}

  @Post()
  create(@Req() req, @Body() dto: CreateChatDto) {
    return this.chatService.create(+req.user.id, dto);
  }

  @Get('')
  getAllUsersChats(@Req() req, @Query() q) {
    const { page, limit } = q;
    return this.chatService.findUserChats(+req.user.id, +page, +limit);
  }

  @UseGuards(AccessGuard)
  @Access({ chat: ChatAccessLevel.MEMBER })
  @Post('/:chatId/messages')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file' }]))
  sendMessage(
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

  @UseGuards(AccessGuard)
  @Access({ chat: ChatAccessLevel.MEMBER })
  @Get(':chatId')
  getById(@Param('chatId', ParseIntPipe) id: number) {
    return this.chatService.findById(id);
  }

  @UseGuards(AccessGuard)
  @Access({ chat: ChatAccessLevel.ADMIN })
  @UseInterceptors(FileInterceptor('chatPhoto'))
  @Patch(':chatId')
  async update(
    @Param('chatId', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateChatDto>,
    @UploadedFile() chatPhoto: Express.Multer.File,
  ) {
    await this.chatService.update(id, dto, chatPhoto);
    return {
      message: 'updated successfully',
    };
  }

  @UseGuards(AccessGuard)
  @Access({ chat: ChatAccessLevel.MEMBER })
  @Get(':chatId/messages')
  async getAllMessage(
    @Req() req,
    @Param('chatId', ParseIntPipe) chatId: number,
    @Query() q,
  ) {
    const { page, limit } = q;
    return this.messageService.getAllMessageOfChat(
      req.user.id,
      chatId,
      page,
      limit,
    );
  }
}
