import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryFailedError, Repository } from 'typeorm';
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
  async create(createUserDto: CreateUserDto) {
    try {
      const hashPassword = await this.hashService.hash(createUserDto.password);
      return await this.userRepository.save({
        ...createUserDto,
        password: hashPassword,
      });
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new ConflictException({
          errorMessage: 'Пользователь с таким email уже существует',
        });
      }
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOneByName(username: string): Promise<User> {
    return await this.userRepository.findOneBy({ username });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
