import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatUser } from './entities/chat-user.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat-dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatUser) private chatUserRepo: Repository<ChatUser>,
    @InjectRepository(Chat) private chatRepo: Repository<Chat>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async findUserChats(userId: number, page: number = 1, limit: number = 10) {
    if (!page && page <= 0) page = 1;
    if (!limit && limit <= 0) limit = 10;

    const skip = (page - 1) * limit;
    const [chats, total] = await this.chatUserRepo.findAndCount({
      where: { userId },
      skip,
      take: limit,
      relations: { chat: true },
    });

    return {
      chats,
      total,
    };
  }

  async create(userId: number, data: CreateChatDto) {
    const { isGroup, name, picUrl, members } = data;

    // validation checks
    if (isGroup) {
      if (!name) {
        throw new BadRequestException('chat group should have name');
      }
    } else {
      if (!members) {
        throw new BadRequestException(
          'atleast two users required for personal',
        );
      }
      if (members.length !== 1) {
        throw new BadRequestException('one users allowed for personal chat');
      }
    }
    // create and save chat
    const chat = this.chatRepo.create({
      isGroup,
      name: isGroup ? name : undefined,
      picUrl: isGroup ? picUrl : undefined,
    });

    const savedChat = await this.chatRepo.save(chat);

    // save chat_users entries for creator
    const chatUser = this.chatUserRepo.create({
      chatId: savedChat.id,
      userId,
      isAdmin: isGroup ? true : false,
    });
    await this.chatUserRepo.save(chatUser);

    // save other members
    await Promise.all(
      members.map((memberId) =>
        this.chatUserRepo.save({
          chatId: savedChat.id,
          userId: memberId,
          isAdmin: false,
        }),
      ),
    );

    return savedChat;
  }

  async findById(id: number) {
    return this.chatRepo.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<CreateChatDto>) {
    await this.chatRepo.update({ id }, data);
    return null;
  }
}
