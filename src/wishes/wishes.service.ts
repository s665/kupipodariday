import { ForbiddenException, Injectable } from '@nestjs/common';
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
    await this.wishRepository.save({
      ...createWishDto,
      owner: { id: userId },
    });
  }

  async findLast() {
    return await this.wishRepository.find({
      relations: ['owner', 'offers'],
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
    return await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
  }

  async update(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.findOne(id);
    if (userId !== wish.owner.id) {
      throw new ForbiddenException();
    }
    await this.wishRepository.update(id, updateWishDto);
  }

  async remove(id: number, userId: number) {
    const wish = await this.findOne(id);
    if (userId !== wish.owner.id) {
      throw new ForbiddenException();
    }
    const result = await this.wishRepository.delete(id);

    if (result.affected === 1) {
      return wish;
    }
  }
}
