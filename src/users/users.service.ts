import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from '../hash/hash.service';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    new User();
    const hashPassword = await this.hashService.hash(createUserDto.password);
    return this.userRepository.save({
      ...createUserDto,
      password: hashPassword,
    });
  }

  async findOne(where: Partial<User>): Promise<User> {
    return await this.userRepository.findOneBy(where);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.hasOwnProperty('password')) {
      updateUserDto.password = await this.hashService.hash(
        updateUserDto.password,
      );
    }
    await this.userRepository.update(id, updateUserDto);
    return this.findOne({ id });
  }

  async findWishes(id): Promise<Wish[]> {
    const { wishes } = await this.userRepository.findOne({
      where: { id },
      relations: ['wishes', 'wishes.owner'],
    });

    return wishes;
  }
}
