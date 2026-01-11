import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
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

  async findById(id: number) {
    return await this.userRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string, isVerified = true) {
    const searchOption: { email: string; isVerified?: boolean } = { email };

    if (isVerified) {
      searchOption.isVerified = true;
    }
    const u = await this.userRepo.findOne({ where: searchOption });
    return u;
  }

  async findAll(
    email: string,
    name: string,
    page: number = 1,
    limit: number = 10,
    sort: string = 'name',
    order: number = 1,
  ) {
    if (!page) page = 1;
    if (!limit) limit = 10;
    if (!order) order = 1;
    const skip = (page - 1) * limit;
    const orderBy = order === 1 ? 'ASC' : 'DESC';
    const searchOption: { name?: any; email?: any } = {};

    if (name) {
      searchOption.name = ILike(`%${name}%`);
    }
    if (email) {
      searchOption.email = ILike(`%${email}%`);
    }

    const [data, total] = await this.userRepo.findAndCount({
      where: searchOption,
      order: { [sort]: orderBy },
      skip,
      take: limit,
      select: ['id', 'name', 'email', 'picUrl'],
    });

    return {
      data,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: number, data: UpdateUserDto) {
    await this.userRepo.update({ id }, data);
    return null;
  }
}
