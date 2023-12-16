import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { FindUserDto } from './dto/find-user.dto';
import { ReqUser } from '../auth/decorators/request-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@ReqUser() id): Promise<User> {
    return this.usersService.findOne({ id });
  }

  @Patch('me')
  patchMe(@ReqUser() id, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.updateOne(id, updateUserDto);
  }

  @Get('me/wishes')
  getMyWishes(@ReqUser() id: number): Promise<Wish[]> {
    return this.usersService.findWishesByUserId(id);
  }

  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.usersService.findOne({ username });
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    return this.usersService.findWishesByUsername(username);
  }

  @Post('find')
  findUsers(@Body() { query }: FindUserDto) {
    return this.usersService.findMany(query);
  }
}
