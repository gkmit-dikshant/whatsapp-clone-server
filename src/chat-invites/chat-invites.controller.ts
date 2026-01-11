import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Access } from 'src/auth/decorators/access.decorators';
import { AccessGuard } from 'src/auth/role.guard';
import { ChatAccessLevel } from 'src/enum/chat-access.enum';
import { CreateChatInviteDto } from './dto/create-chat-invite.dto';
import { ChatInvitesService } from './chat-invites.service';
import { Public } from 'src/auth/auth.guard';

@Controller('chat-invites')
export class ChatInvitesController {
  constructor(private chatInviteService: ChatInvitesService) {}

  @UseGuards(AccessGuard)
  @Access({ chat: ChatAccessLevel.ADMIN })
  @Post('chats/:chatId')
  async create(
    @Req() req,
    @Param('chatId', ParseIntPipe) chatId: number,
    @Body() dto: CreateChatInviteDto,
  ) {
    const { token } = await this.chatInviteService.create(
      req.user.id,
      chatId,
      dto,
    );
    return {
      message: 'invite sent successfully',
      token,
    };
  }

  @Public()
  @Get('accept')
  async updateStatus(@Req() req, @Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('please provide token');
    }

    await this.chatInviteService.updateStatus(token);
    return {
      message: `invite accepted successfully`,
    };
  }
}
