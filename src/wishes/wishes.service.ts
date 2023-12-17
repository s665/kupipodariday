import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}
  async create(userId: number, createWishDto: CreateWishDto) {
    const wish = await this.wishRepository.create({
      ...createWishDto,
      owner: { id: userId },
    });

    return await this.wishRepository.save(wish);
  }

  async findLast() {
    return await this.wishRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
  }

  async findTop() {
    return await this.wishRepository.find({
      relations: ['owner', 'offers'],
      order: {
        copied: 'DESC',
      },
      take: 10,
    });
  }

  async findOne(id: number) {
    return await this.wishRepository.findOneOrFail({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async updateOne(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.findOne(id);
    if (userId !== wish.owner.id) {
      throw new ForbiddenException();
    }
    await this.wishRepository.update(id, updateWishDto);
  }

  async removeOne(id: number, userId: number) {
    const wish = await this.findOne(id);
    if (userId !== wish.owner.id) {
      throw new ForbiddenException();
    }
    const result = await this.wishRepository.delete(id);

    if (result.affected === 1) {
      return wish;
    }
  }

  async copy(id: number, userId: number) {
    const myWish = await this.wishRepository.findOneBy({
      id,
      owner: { id: userId },
    });
    if (myWish) {
      throw new ConflictException('Нельзя копировать свои подарки');
    }
    const wish = await this.wishRepository.findOneByOrFail({
      id,
    });

    const newWish = await this.wishRepository.save({
      name: wish.name,
      price: wish.price,
      description: wish.description,
      image: wish.image,
      link: wish.link,
      owner: { id: userId },
    });
    await this.wishRepository.save({ ...wish, copied: wish.copied + 1 });

    return newWish;
  }
}
