import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Wish } from './entities/wish.entity';
import { Offer } from '../offers/entities/offer.entity';
import { Wishlist } from '../wishlist/entities/wishlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish, Offer])],
  controllers: [WishesController],
  providers: [WishesService],
})
export class WishesModule {}
