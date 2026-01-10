import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { createUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  async create(data: createUserDto) {
    const u = await this.userRepo.save(data);
    return u;
  }

  async findByEmail(email: string, isVerified = true) {
    const searchOption: { email: string; isVerified?: boolean } = { email };

    if (isVerified) {
      searchOption.isVerified = true;
    }
    const u = await this.userRepo.findOne({ where: searchOption });
    return u;
  }

  async update(id: number, data: UpdateUserDto) {
    return await this.userRepo.update({ id }, { ...data });
  }
}
