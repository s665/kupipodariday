import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Offer } from '../offers/entities/offer.entity';
import { Wishlist } from '../wishlist/entities/wishlist.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish, Offer, Wishlist])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
