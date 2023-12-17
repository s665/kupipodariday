import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { DataSource, Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createOfferDto: CreateOfferDto, userId: number) {
    const wish = await this.wishRepository.findOne({
      where: {
        id: createOfferDto.itemId,
      },
      relations: {
        owner: true,
      },
    });

    if (!wish)
      throw new BadRequestException('Подарка с таким id не существует');
    if (wish.owner.id === userId)
      throw new BadRequestException('Нельзя скинуться себе на подарок');
    if (wish.price < createOfferDto.amount) {
      throw new BadRequestException('Слишком большая сумма');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.offerRepository.save({
        amount: createOfferDto.amount,
        item: { id: wish.id },
        user: { id: userId },
      });
      await this.wishRepository.update(wish.id, {
        raised: wish.raised + createOfferDto.amount,
      });

      return {};
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: number) {
    return await this.offerRepository.findOne({
      where: { id },
      relations: {
        user: {
          offers: true,
          wishlists: {
            items: true,
          },
        },
      },
    });
  }

  async findMany() {
    return await this.offerRepository.find({
      relations: {
        user: {
          offers: true,
          wishlists: {
            items: true,
          },
        },
      },
    });
  }
}
