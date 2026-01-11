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
  UseGuards,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat-dto';
import { AccessGuard } from 'src/auth/role.guard';
import { Access } from 'src/auth/decorators/access.decorators';
import { ChatAccessLevel } from 'src/enum/chat-access.enum';
import { MessagesService } from 'src/messages/messages.service';

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
  @Get(':chatId')
  getById(@Param('chatId', ParseIntPipe) id: number) {
    return this.chatService.findById(id);
  }

  @UseGuards(AccessGuard)
  @Access({ chat: ChatAccessLevel.ADMIN })
  @Patch(':chatId')
  async update(
    @Param('chatId', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateChatDto>,
  ) {
    await this.chatService.update(id, dto);
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
