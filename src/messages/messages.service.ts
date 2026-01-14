import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MoreThan, Repository } from 'typeorm';
import { MediaService } from 'src/media/media.service';
import { MessageMedia } from 'src/media/entities/message-media.entity';
import { ChatUser } from 'src/chats/entities/chat-user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(MessageMedia)
    private messageMediaRepo: Repository<MessageMedia>,
    @InjectRepository(ChatUser) private chatUserRepo: Repository<ChatUser>,
    private mediaService: MediaService,
  ) {}
  async create(
    userId: number,
    chatId: number,
    data: { content: string; media?: string[] },
    files?: Express.Multer.File[],
  ) {
    const { content } = data;

    const message = this.messageRepo.create({
      userId,
      chatId,
      content,
    });

    // save the message
    const savedMessage = await this.messageRepo.save(message);

    // update the chats updated_at for all members
    await this.chatUserRepo.update(
      { chatId },
      { updatedAt: () => 'CURRENT_TIMESTAMP' },
    );

    if (files?.length) {
      await Promise.all(
        files.map(async (file) => {
          const { file: uploaded, type } =
            await this.mediaService.uploadFile(file);

          await this.messageMediaRepo.save({
            messageId: savedMessage.id,
            url: uploaded.Location,
            mediaType: type,
          });
        }),
      );
    }

    const result = await this.messageRepo.findOne({
      where: { id: savedMessage.id },
      relations: {
        messageMedia: true,
      },
      select: {
        messageMedia: {
          id: true,
          url: true,
          mediaType: true,
          createdAt: true,
        },
      },
    });

    return result;
  }

  async update(userId: number, id: number, content: string) {
    const message = await this.messageRepo.findOne({ where: { id, userId } });
    if (!message) {
      throw new NotFoundException(`no message found with id ${id}`);
    }

    const lastMessage = await this.messageRepo.find({
      where: { chatId: message.chatId, userId },
      order: { createdAt: 'DESC' },
      take: 1,
    });

    if (lastMessage[0].id !== id) {
      throw new BadRequestException('you can only update last sent message');
    }

    await this.messageRepo.update({ id }, { content });
    return null;
  }

  async delete(userId: number, id: number) {
    const message = await this.messageRepo.findOne({ where: { id, userId } });
    if (!message) {
      throw new NotFoundException(`no message found with id ${id}`);
    }
    const lastMessage = await this.messageRepo.find({
      where: { chatId: message.chatId, userId },
      order: { createdAt: 'DESC' },
      take: 1,
    });

    if (lastMessage[0].id !== id) {
      throw new BadRequestException('you can only delete last sent message');
    }

    await this.messageRepo.softDelete({ id });

    return 'deleted';
  }

  async getAllMessageOfChat(
    userId: number,
    chatId: number,
    page: number = 1,
    limit: number = 10,
  ) {
    if (!page && page <= 0) page = 1;
    if (!limit && limit <= 0) limit = 10;

    const chatUser = await this.chatUserRepo.findOne({
      where: { userId, chatId },
      select: { id: true, createdAt: true },
    });

    if (!chatUser) {
      throw new NotFoundException(
        `no chat found with id ${chatId} in you chats`,
      );
    }

    const skip = (page - 1) * limit;
    const [messages, total] = await this.messageRepo.findAndCount({
      where: { chatId, createdAt: MoreThan(chatUser.createdAt) },
      skip,
      take: limit,
      order: { createdAt: 'desc' },
      relations: { messageMedia: true, user: true },
      select: {
        id: true,
        userId: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        messageMedia: {
          id: true,
          url: true,
          mediaType: true,
          createdAt: true,
        },
      },
    });

    const processed: any[] = [];

    messages.forEach((msg: Message) => {
      if (msg.userId === userId) {
        processed.push({
          id: msg.id,
          content: msg.content,
          media: msg.messageMedia,
          user: { id: msg.user.id, name: msg.user.name },
          isLeft: false,
        });
      } else {
        processed.push({
          id: msg.id,
          content: msg.content,
          media: msg.messageMedia,
          user: { id: msg.user.id, name: msg.user.name },
          isLeft: true,
        });
      }
    });

    return {
      messages: processed,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
