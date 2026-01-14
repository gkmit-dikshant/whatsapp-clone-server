import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { createUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private mediaService: MediaService,
  ) {}
  async create(data: createUserDto) {
    const user = await this.userRepo.save(data);
    return user;
  }

  async findById(id: number) {
    return await this.userRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string, isVerified = true) {
    const searchOption: { email: string; isVerified?: boolean } = { email };

    if (isVerified) {
      searchOption.isVerified = true;
    }
    const user = await this.userRepo.findOne({ where: searchOption });
    return user;
  }

  async findAll(
    email: string | undefined,
    name: string | undefined,
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
      where: { ...searchOption, isVerified: true },
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

  async update(
    id: number,
    data: UpdateUserDto,
    profilePhoto?: Express.Multer.File,
  ) {
    if (profilePhoto) {
      data.picUrl = undefined;
      const { file } = await this.mediaService.uploadFile(profilePhoto);
      data.picUrl = file.Location;
    }
    await this.userRepo.update({ id }, data);
    return null;
  }
}
