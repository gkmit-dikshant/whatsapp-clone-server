import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatInvite } from './entities/chat-invites.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { ChatUser } from 'src/chats/entities/chat-user.entity';

@Injectable()
export class ChatInvitesService {
  constructor(
    @InjectRepository(ChatInvite)
    private chatInviteRepo: Repository<ChatInvite>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(ChatUser) private chatUserRepo: Repository<ChatUser>,
    private mailService: MailerService,
  ) {}
  async create(
    fromUserId: number,
    chatId: number,
    data: { sendTo: string; expiry?: number },
  ) {
    const { sendTo, expiry } = data;
    const u = await this.userRepo.findOne({
      where: { email: sendTo },
      select: ['id', 'email'],
    });

    if (!u) {
      throw new BadRequestException(`user with email ${sendTo} does'nt exist`);
    }

    const existingInvite = await this.chatInviteRepo.findOne({
      where: {
        chatId,
        toUserId: u.id,
        isAccepted: false,
      },
    });

    if (existingInvite) {
      throw new BadRequestException('User already has a pending invitation');
    }

    const rawToken = this.generateInviteToken();
    const token = this.hashToken(rawToken);

    const invite = this.chatInviteRepo.create({
      chatId,
      toUserId: u.id,
      fromUserId,
      expiry,
      token,
    });

    await this.chatInviteRepo.save(invite);
    const acceptUrl = `http://localhost:${process.env.SERVER_PORT}/chat-invites/accept?token=${rawToken}`;
    this.mailService
      .sendMail({
        to: u.email,
        subject: 'Chat invitation',
        html: `
      <p>You have been invited to join a chat.</p>

      <p>
        <a href="${acceptUrl}">
          Accept invitation
        </a>
      </p>

      <p>
        This invitation expires in ${expiry ? expiry / 60 : '24'} hr.
      </p>
    `,
      })
      .then(() => console.log('invite email sent successfully'))
      .catch(() => console.log('failed to send invite email'));

    return {
      token: rawToken,
    };
  }

  async updateStatus(token: string) {
    const hashToken = this.hashToken(token);
    const invite = await this.chatInviteRepo.findOne({
      where: { token: hashToken, isAccepted: false },
    });

    if (!invite) {
      throw new NotFoundException();
    }

    const remainTime =
      (Date.now() - new Date(invite?.createdAt).getTime()) / 60000;

    if (remainTime > invite.expiry) {
      throw new ForbiddenException('invite expired');
    }

    await this.chatUserRepo.save({
      userId: invite.toUserId,
      chatId: invite.chatId,
    });

    invite.isAccepted = true;
    await this.chatInviteRepo.save(invite);
  }

  generateInviteToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
