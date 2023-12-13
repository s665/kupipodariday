import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { FindUserDto } from './dto/find-user.dto';
import { isEmail } from 'class-validator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Req() req): Promise<User> {
    const me = this.usersService.findOne({ id: req.user.id });

    if (!me) {
      throw new NotFoundException();
    }

    return me;
  }

  @Patch('me')
  patchMe(@Req() req, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  getMyWishes(@Req() req): Promise<Wish[]> {
    return this.usersService.findWishes(req.user.id);
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
