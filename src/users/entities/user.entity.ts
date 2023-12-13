import { BaseEntity } from '../../base.entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
