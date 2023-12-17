import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { ReqUser } from '../auth/decorators/request-user.decorator';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@ReqUser() id, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto, id);
  }

  @Get()
  findAll() {
    return this.offersService.findMany();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.offersService.findOne(id);
  }
}
