import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Public } from '../auth/decorators/public-decorator';
import { ReqUser } from '../auth/decorators/request-user.decorator';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(@ReqUser() id, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(id, createWishDto);
  }

  @Public()
  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Public()
  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishesService.findOne(id);
  }

  @Patch(':id')
  update(
    @ReqUser() userId,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateOne(+id, updateWishDto, userId);
  }

  @Delete(':id')
  remove(@ReqUser() userId, @Param('id') id: number) {
    return this.wishesService.removeOne(id, userId);
  }

  @Post(':id/copy')
  copyWish(@ReqUser() userId, @Param('id') id: number) {
    return this.wishesService.copy(id, userId);
  }
}
