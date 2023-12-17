import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Like, QueryFailedError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashPassword = await this.hashService.hash(createUserDto.password);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashPassword,
      });
      return await this.userRepository.save(user);
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.code === '23505') {
        throw new ConflictException('Такой пользователь уже существует');
      }
    }
  }

  async findOne(where: Partial<User>): Promise<User> {
    return await this.userRepository.findOneByOrFail(where);
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.hasOwnProperty('password')) {
      updateUserDto.password = await this.hashService.hash(
        updateUserDto.password,
      );
    }
    try {
      await this.userRepository.update(id, updateUserDto);
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.code === '23505') {
        throw new ConflictException('Такой пользователь уже существует');
      }
    }

    return this.findOne({ id });
  }

  async findWishesByUserId(id: number) {
    const user = await this.userRepository.findOneOrFail({
      relations: {
        wishes: {
          owner: true,
          offers: true,
        },
      },
      where: {
        id,
      },
    });
    return user.wishes;
  }

  async findWishesByUsername(username: string) {
    const user = await this.userRepository.findOneOrFail({
      relations: {
        wishes: {
          owner: true,
          offers: true,
        },
      },
      where: {
        username,
      },
    });
    return user.wishes;
  }

  async findMany(user: string) {
    return await this.userRepository.find({
      where: [{ username: Like(`%${user}%`) }, { email: Like(`%${user}%`) }],
    });
  }
}
