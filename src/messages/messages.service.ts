import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { MediaService } from 'src/media/media.service';
import { MessageMedia } from 'src/media/entities/message-media.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(MessageMedia)
    private messageMediaRepo: Repository<MessageMedia>,
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

    const savedMessage = await this.messageRepo.save(message);

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
    const c = await this.messageRepo.findOne({ where: { id, userId } });
    if (!c) {
      throw new NotFoundException();
    }

    const lastMessage = await this.messageRepo.find({
      where: { chatId: c.chatId, userId },
      order: { createdAt: 'DESC' },
      take: 1,
    });

    if (lastMessage[0].id !== id) {
      throw new ForbiddenException('you can only update last sent message');
    }

    await this.messageRepo.update({ id }, { content });
    return null;
  }

  async delete(userId: number, id: number) {
    const c = await this.messageRepo.findOne({ where: { id, userId } });
    if (!c) {
      throw new NotFoundException();
    }
    const lastMessage = await this.messageRepo.find({
      where: { chatId: c.chatId, userId },
      order: { createdAt: 'DESC' },
      take: 1,
    });

    if (lastMessage[0].id !== id) {
      throw new ForbiddenException('you can only delete last sent message');
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

    const skip = (page - 1) * limit;
    const [messages, total] = await this.messageRepo.findAndCount({
      where: { chatId },
      skip,
      take: limit,
      order: { createdAt: 'desc' },
      relations: { messageMedia: true },
      select: {
        id: true,
        content: true,
        userId: true,
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

    const processed: {
      send: Message[];
      received: Message[];
    } = {
      send: [],
      received: [],
    };

    messages.forEach((msg: Message) => {
      if (msg.userId === userId) {
        processed.send.push(msg);
      } else {
        processed.received.push(msg);
      }
    });

    return {
      messages: processed,
      total,
    };
  }
}
