import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Req,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { type AuthRequest } from 'src/types/auth-request';

@Controller('messages')
export class MessagesController {
  constructor(private messageService: MessagesService) {}

  @Patch(':id')
  async update(
    @Req() req: AuthRequest,
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
  async delete(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    await this.messageService.delete(req.user.id, id);
    return null;
  }
}
