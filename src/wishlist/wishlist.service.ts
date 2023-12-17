import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishListRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, userId: number) {
    const { itemsId, ...rest } = createWishlistDto;
    const items = itemsId.map((item) => ({ id: item }));
    const { id } = await this.wishListRepository.save({
      ...rest,
      owner: { id: userId },
      items: items,
    });

    return await this.findOne(id);
  }

  async findAll() {
    return await this.wishListRepository.find({
      relations: {
        owner: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.wishListRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const { itemsId, ...rest } = updateWishlistDto;
    const items = itemsId ? itemsId.map((item) => ({ id: item })) : null;
    const wishList = await this.wishListRepository.findOne({
      where: {
        id,
        owner: {
          id: userId,
        },
      },
      relations: {
        owner: true,
        items: true,
      },
    });
    if (wishList.owner.id !== userId) throw new ForbiddenException();
    await this.wishListRepository.save({
      ...wishList,
      ...rest,
      owner: { id: userId },
      items: items ? items : wishList.items,
    });
    return this.findOne(id);
  }

  async remove(id: number, userId: number) {
    const wishList = await this.wishListRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
      },
    });
    if (wishList.owner.id !== userId) throw new ForbiddenException();
    await this.wishListRepository.remove(wishList);
    return wishList;
  }
}
