import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatUser } from './entities/chat-user.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat-dto';
import { MediaService } from 'src/media/media.service';
import { ChatInvitesService } from 'src/chat-invites/chat-invites.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatUser) private chatUserRepo: Repository<ChatUser>,
    @InjectRepository(Chat) private chatRepo: Repository<Chat>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private chatInviteService: ChatInvitesService,
    private mediaService: MediaService,
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

    const data = chats.map((c) => {
      return { ...c.chat };
    });

    return {
      chats: data,
      total,
    };
  }

  async create(userId: number, data: CreateChatDto) {
    const { isGroup, name, picUrl, members } = data;

    // validation checks
    if (isGroup) {
      if (!name) {
        throw new BadRequestException('group chat should have name');
      }
      if (members.length === 0) {
        throw new BadRequestException(
          'group chat should atleast have 1 member',
        );
      }
    } else {
      if (!members) {
        throw new BadRequestException(
          'atleast two users required for personal chat',
        );
      }
      if (members.length !== 1) {
        throw new BadRequestException(
          'only one users allowed for personal chat',
        );
      }

      // personal chat
      const existingChat = await this.chatRepo
        .createQueryBuilder('chat')
        .innerJoin('chat_users', 'u1', 'u1.chat_id = chat.id')
        .innerJoin('chat_users', 'u2', 'u2.chat_id = chat.id')
        .where('chat.is_group = false')
        .andWhere('u1.user_id = :userId', { userId })
        .andWhere('u2.user_id = :memberId', {
          memberId: members[0],
        })
        .getOne();

      if (existingChat) {
        return existingChat;
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

    if (!isGroup) {
      // save other member
      await Promise.all(
        members.map((memberId) =>
          this.chatUserRepo.save({
            chatId: savedChat.id,
            userId: memberId,
            isAdmin: false,
          }),
        ),
      );
    } else {
      // send invite to members
      Promise.all(
        members.map(async (memberId) => {
          if (memberId !== userId) {
            const u = await this.userRepo.findOne({
              where: { id: memberId },
              select: { id: true, email: true },
            });

            if (u) {
              return this.chatInviteService.create(userId, savedChat.id, {
                sendTo: u.email,
              });
            }
          }
        }),
      )
        .then(() => console.log('invtes sent successfully'))
        .catch(() => console.log('failed to send invites'));
    }

    return {
      id: savedChat.id,
      name: savedChat.name,
      about: savedChat.about,
      picUrl: savedChat.picUrl,
      isGroup: savedChat.isGroup,
      createdAt: savedChat.createdAt,
      updatedAt: savedChat.updatedAt,
    };
  }

  async findById(id: number) {
    const chat = await this.chatRepo.findOne({
      where: { id },
      relations: ['chatUsers', 'chatUsers.user'],
    });

    if (!chat) {
      throw new NotFoundException();
    }

    const members = chat?.chatUsers.map((chat_user) => {
      return { ...chat_user.user, isAdmin: chat_user.isAdmin };
    });
    return {
      id: chat.id,
      name: chat.name,
      about: chat?.about,
      picUrl: chat?.picUrl,
      isGroup: chat?.isGroup,
      members,
    };
  }

  async update(
    id: number,
    data: Partial<CreateChatDto>,
    chatPhoto?: Express.Multer.File,
  ) {
    const existing = await this.chatRepo.findOne({ where: { id } });

    if (!existing) {
      throw new NotFoundException();
    }

    if (data.isGroup) {
      throw new ForbiddenException('group type cant be updated');
    }

    if (!existing.isGroup && chatPhoto) {
      throw new ForbiddenException('personal chat cant have photo');
    }

    data.picUrl = undefined;
    if (chatPhoto) {
      const { file } = await this.mediaService.uploadFile(chatPhoto);
      data.picUrl = file.Location;
    }
    await this.chatRepo.update({ id }, data);
    return null;
  }
}
