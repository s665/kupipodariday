import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { ReqUser } from '../auth/decorators/request-user.decorator';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlistlists')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  create(@ReqUser() id, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistService.create(createWishlistDto, id);
  }

  @Get()
  findAll() {
    return this.wishlistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @ReqUser() userId,
  ) {
    return this.wishlistService.update(id, updateWishlistDto, userId);
  }

  @Delete(':id')
  remove(@ReqUser() userId, @Param('id') id: number) {
    return this.wishlistService.remove(id, userId);
  }
}
