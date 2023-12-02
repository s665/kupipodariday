import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { OffersModule } from './offers/offers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from './config/TypeOrmConfigService';
import { WinstonModule } from 'nest-winston';
import { WinstonConfigService } from './config/WinstonConfigService';

@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule.forRootAsync({
      imports: [WinstonModule],
      useClass: WinstonConfigService,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({})],
      inject: [ConfigService],
      useClass: TypeOrmConfigService,
    }),
    UsersModule,
    WishesModule,
    WishlistModule,
    OffersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
