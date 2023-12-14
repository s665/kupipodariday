import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { FindUserDto } from './dto/find-user.dto';
import { isEmail } from 'class-validator';
import { ReqUser } from '../auth/decorators/request-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@ReqUser() id): Promise<User> {
    const me = this.usersService.findOne({ id });

    if (!me) {
      throw new NotFoundException();
    }

    return me;
  }

  @Patch('me')
  patchMe(@ReqUser() id, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Get('me/wishes')
  getMyWishes(@ReqUser() id): Promise<Wish[]> {
    return this.usersService.findWishes(id);
  }

  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.usersService.findOne({ username });
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    const { id } = await this.usersService.findOne({ username });
    return this.usersService.findWishes(id);
  }

  @Post('find')
  findUser(@Body() { query }: FindUserDto) {
    if (isEmail(query)) {
      return this.usersService.findOne({ email: query });
    }
    return this.usersService.findOne({ username: query });
  }
}
